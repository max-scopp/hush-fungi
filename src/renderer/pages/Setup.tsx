import { Alert, Button, Flex, Input, Result } from "antd";
import { log } from "electron-log";
import { createLongLivedTokenAuth, getAuth } from "home-assistant-js-websocket";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import {
  APP_INTERNAL_SERVER_ADRESS,
  DEFAULT_HASS_URL,
  STORE_HASS_AUTH,
  STORE_HASS_URL,
} from "../../shared/constants";
import { EmojiIcon } from "../modules/Common/components/EmojiIcon";

const hassUrl = String(
  window.electron.storage.get(STORE_HASS_URL) ?? DEFAULT_HASS_URL,
);
const url = new URL(location.href);
const initialState = {
  isAuthCallback: url.searchParams.has("auth_callback"),
  handledAuthCallback: false as boolean,
} as const;

type AuthCallbackState = typeof initialState;

const useAuthCallback = create<AuthCallbackState>((set) => {
  async function handleCallbackAsync() {
    log(`Trying authentication against instance ${hassUrl}`);

    const retrievedAuth = await authenticateHass(() =>
      set({ handledAuthCallback: true }),
    );

    const long = createLongLivedTokenAuth(hassUrl, retrievedAuth.accessToken);
    await long.refreshAccessToken();
    log("hass: long lived token refreshed");
  }

  if (initialState.isAuthCallback) {
    handleCallbackAsync();
  }

  return initialState;
});

function authenticateHass(onSave?: () => void) {
  return getAuth({
    hassUrl,
    clientId: APP_INTERNAL_SERVER_ADRESS,
    redirectUrl: APP_INTERNAL_SERVER_ADRESS,
    saveTokens: (data) => {
      window.electron.storage.set(STORE_HASS_AUTH, data);
      window.hass.reconnect();
      onSave?.();
    },
  });
}

export function Setup() {
  const navigate = useNavigate();
  const [userHassUrl, setUserHassUrl] = useState(hassUrl);
  const [isValidUrl, setIsValidUrl] = useState(true);

  const ac = useAuthCallback();

  // double check url before assuming user is correct
  useEffect(() => {
    try {
      const parsedUrl = new URL(userHassUrl);
      if (
        // must be http(s) and include a tld
        ["http:", "https:"].includes(parsedUrl.protocol) &&
        parsedUrl.hostname.match(/\.\w+$/)
      ) {
        console.log(parsedUrl);
        setIsValidUrl(true);
      } else {
        setIsValidUrl(false);
      }
    } catch (error) {
      setIsValidUrl(false);
    }
  }, [userHassUrl]);

  const handleHassUrlAndRunFirstAuth = useCallback(async () => {
    window.electron.storage.set(STORE_HASS_URL, userHassUrl);

    await authenticateHass();
  }, []);

  if (ac.isAuthCallback) {
    if (ac.handledAuthCallback) {
      setTimeout(() => navigate("/"), 300);
      return <Result status="success" title="Connected!"></Result>;
    }

    return <Result status="info" title="Connecting..."></Result>;
  }

  return (
    <Result
      status="info"
      icon={<EmojiIcon emoticon="🤗" />}
      title="Welcome to HushFungi"
      subTitle="We need to connect to your Home Assistant instance. Please enter your HASS address below to get started."
      extra={
        isValidUrl ? (
          <></>
        ) : (
          <Alert type="error" message="Please double check your HASS address" />
        )
      }
    >
      <Flex gap={10}>
        <Input
          style={{ flex: 1 }}
          placeholder="Example"
          defaultValue={userHassUrl}
          onChange={(event) => setUserHassUrl(event.currentTarget.value)}
        />

        <Button
          type="primary"
          key="console"
          onClick={handleHassUrlAndRunFirstAuth}
        >
          Authenticate in Browser
        </Button>
      </Flex>
    </Result>
  );
}
