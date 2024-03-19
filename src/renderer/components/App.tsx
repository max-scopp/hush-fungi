import { LoadingOutlined } from "@ant-design/icons";
import { ConfigProvider, Spin } from "antd";
import { log } from "electron-log";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Suspense, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import { channels } from "../../shared/channels";
import { buildTheme } from "../buildTheme";
import { router } from "../router";
import styles from "./App.module.scss";
import { DebugHint } from "./DebugHint";
import { Titlebar } from "./Titlebar";

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
        <Suspense
          fallback={
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          }
        >
          <OverlayScrollbarsComponent
            defer
            options={{
              scrollbars: {
                theme: isDarkMode ? "os-theme-light" : "os-theme-dark",
              },
            }}
            className={styles.scrollContainer}
          >
            <Titlebar />
            <RouterProvider router={router} />
          </OverlayScrollbarsComponent>
          <DebugHint />
        </Suspense>
      </ConfigProvider>
    </>
  );
}
