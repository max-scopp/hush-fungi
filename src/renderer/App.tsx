import { Button, ConfigProvider, DatePicker, Space } from "antd";
import { log } from "electron-log";
import { useState } from "react";
import { channels } from "../shared/channels";
import { buildTheme } from "./buildTheme";

export function App() {
  const [theme, setTheme] = useState(buildTheme());

  window.electron.ipcRenderer.on(channels.ACCENT_COLOR_CHANGED, () => {
    log("must rebuild theme");
    setTheme(buildTheme());
  });
  return (
    <>
      <ConfigProvider theme={theme}>
        <div
          style={{ padding: "20px", background: "hsl(0deg 100% 50% / 12%)" }}
        >
          hello from react!
          <Space>
            <DatePicker />
            <Button type="primary">Primary Button</Button>
          </Space>
        </div>
      </ConfigProvider>
    </>
  );
}
