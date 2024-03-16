import { Alert, Button, ConfigProvider, DatePicker, Space } from "antd";
import { log } from "electron-log";
import { useState } from "react";
import { channels } from "../shared/channels";
import { buildTheme } from "./buildTheme";

export function App() {
  const [theme, setTheme] = useState(buildTheme());

  window.electron.ipcRenderer.on(channels.SYSTEM_PREFERENCES_CHANGED, () => {
    log("must rebuild theme");
    setTheme(buildTheme());
  });
  return (
    <>
      <ConfigProvider theme={theme}>
        <Alert message="Hello fromr react!" />
        <Space>
          <DatePicker />
          <Button type="primary">Primary Button</Button>
        </Space>
      </ConfigProvider>
    </>
  );
}
