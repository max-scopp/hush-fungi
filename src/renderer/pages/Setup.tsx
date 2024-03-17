import { Alert, Button, Flex, Input, Result } from "antd";
import { getAuth } from "home-assistant-js-websocket";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_HASS_URL, STORE_HASS_URL } from "../../shared/constants";
import { EmojiIcon } from "../components/EmojiIcon";

export function Setup() {
  const navigate = useNavigate();
  debugger;

  const [hassUrl, setHassUrl] = useState(DEFAULT_HASS_URL);
  const [isValidUrl, setIsValidUrl] = useState(true);

  useEffect(() => {
    try {
      const parsedUrl = new URL(hassUrl);
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
  }, [hassUrl]);

  const handleHassUrlAndRunFirstAuth = useCallback(async () => {
    window.electron.storage.set(STORE_HASS_URL, hassUrl);

    const retrievedAuth = await getAuth({
      hassUrl,
      clientId: window.electron.remote.getGlobal("localServerAddress"),
      redirectUrl: window.electron.remote.getGlobal("localServerAddress"),
    });

    window.hass.reconnect();
  }, []);

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
          defaultValue={hassUrl}
          onChange={(event) => setHassUrl(event.currentTarget.value)}
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
