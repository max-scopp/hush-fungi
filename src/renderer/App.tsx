import { ConfigProvider } from "antd";
import { log } from "electron-log";
import { createLongLivedTokenAuth, getAuth } from "home-assistant-js-websocket";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Suspense, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import { channels } from "../shared/channels";
import { STORE_HASS_AUTH, STORE_HASS_URL } from "../shared/constants";
import styles from "./App.module.scss";
import { buildTheme } from "./buildTheme";
import { DebugHint } from "./components/DebugHint";
import { router } from "./router";

const url = new URL(location.href);
if (url.searchParams.has("auth_callback")) {
  handleCallbackAsync();
}

async function handleCallbackAsync() {
  const hassUrl = String(window.electron.storage.get(STORE_HASS_URL));
  log(`Trying authentication against instance ${hassUrl}`);

  const retrievedAuth = await getAuth({
    hassUrl,
    saveTokens: (data) => {
      debugger;
      window.electron.storage.set(STORE_HASS_AUTH, data);
    },
  });

  const long = createLongLivedTokenAuth(hassUrl, retrievedAuth.accessToken);
  await long.refreshAccessToken();
  log("hass: long lived token refreshed");
}

export function App() {
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [theme, setTheme] = useState(buildTheme(isDarkMode ? "dark" : "light"));

  window.electron.ipcRenderer.on(channels.SYSTEM_PREFERENCES_CHANGED, () => {
    log("must rebuild theme");
    setTheme(buildTheme(isDarkMode ? "dark" : "light"));
  });

  return (
    <>
      <ConfigProvider theme={theme}>
        <Suspense fallback="establish connection...">
          <OverlayScrollbarsComponent
            defer
            options={{
              scrollbars: {
                theme: isDarkMode ? "os-theme-light" : "os-theme-dark",
              },
            }}
            className={styles.scrollContainer}
          >
            <RouterProvider router={router} />
          </OverlayScrollbarsComponent>
          <DebugHint />
        </Suspense>
      </ConfigProvider>
    </>
  );
}
