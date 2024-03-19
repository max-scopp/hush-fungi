import { LoadingOutlined } from "@ant-design/icons";
import { ConfigProvider, Spin } from "antd";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Suspense, useLayoutEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { buildTheme } from "../buildTheme";
import { router } from "../router";
import styles from "./App.module.scss";
import { DebugHint } from "./DebugHint";
import { Titlebar } from "./Titlebar";

const getThemeMode = () =>
  matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export function App() {
  const themeMode = getThemeMode();
  const [theme, setTheme] = useState(buildTheme(themeMode));

  useLayoutEffect(() => {
    const onFocus = () => {
      setTheme(buildTheme(getThemeMode()));
    };

    window.addEventListener("focus", onFocus);

    return () => window.removeEventListener("focus", onFocus);
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
                theme:
                  themeMode === "dark" ? "os-theme-light" : "os-theme-dark",
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
