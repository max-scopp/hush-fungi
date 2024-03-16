import { ConfigProvider } from "antd";
import { log } from "electron-log";
import { useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { channels } from "../shared/channels";
import { buildTheme } from "./buildTheme";
import { FirstStart } from "./pages/FirstStart";
import { Home } from "./pages/Home";
import { NoRoute } from "./pages/NoRoute";

export function App() {
  const [theme, setTheme] = useState(buildTheme());

  window.electron.ipcRenderer.on(channels.SYSTEM_PREFERENCES_CHANGED, () => {
    log("must rebuild theme");
    setTheme(buildTheme());
  });
  return (
    <>
      <ConfigProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/first-start" element={<FirstStart />} />
            <Route path="*" element={<NoRoute />} />
          </Routes>
        </HashRouter>
      </ConfigProvider>
    </>
  );
}
