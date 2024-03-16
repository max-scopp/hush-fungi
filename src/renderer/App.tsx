import { ConfigProvider } from "antd";
import { log } from "electron-log";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Suspense, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import { channels } from "../shared/channels";
import styles from "./App.module.scss";
import { buildTheme } from "./buildTheme";
import { HassProvider } from "./modules/Hass/HassProvider";
import { FirstStart } from "./pages/FirstStart";
import { Home } from "./pages/Home";
import { NoRoute } from "./pages/NoRoute";

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
          <HassProvider>
            <OverlayScrollbarsComponent
              defer
              options={{
                scrollbars: {
                  theme: isDarkMode ? "os-theme-light" : "os-theme-dark",
                },
              }}
              className={styles.scrollContainer}
            >
              <HashRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/first-start" element={<FirstStart />} />
                  <Route path="*" element={<NoRoute />} />
                </Routes>
              </HashRouter>
            </OverlayScrollbarsComponent>
          </HassProvider>
        </Suspense>
      </ConfigProvider>
    </>
  );
}
