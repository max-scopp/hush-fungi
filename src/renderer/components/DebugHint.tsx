import { Button, Space } from "antd";

export function DebugHint() {
  return (
    <Space
      style={{
        position: "fixed",
        color: "GrayText",
        bottom: "15px",
        right: "15px",
        opacity: "0.5",
        fontSize: "12px",
      }}
    >
      <span>
        <b>HASS</b>{" "}
        <code>{window.hass?.getHaVersion?.() ?? "disconnected"}</code>
      </span>
      <Button
        size="small"
        type="text"
        onClick={() => window.electron.storage.openEditor()}
      >
        edit storage
      </Button>
    </Space>
  );
}
