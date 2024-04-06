import { Badge, Button, Flex } from "antd";
import { ReactNode } from "react";
import { HassConnectionPhase } from "../../main/hass/HassConnectionPhase";

const state: { [key in HassConnectionPhase]: ReactNode } = {
  "failed-auth": <Badge color="cyan" />,
  connected: <Badge color="green" />,
  unknown: <Badge color="yellow" />,
  disconnected: <Badge color="red" />,
  "hass-not-known": <Badge color="grey" />,
};

export function DebugHint() {
  return (
    <Flex
      style={{
        position: "fixed",
        color: "GrayText",
        bottom: "15px",
        right: "15px",
        opacity: "0.5",
        fontSize: "12px",
      }}
      gap="1ch"
    >
      <Button
        size="small"
        type="text"
        onClick={() => window.electron.storage.openEditor()}
      >
        edit storage
      </Button>
    </Flex>
  );
}
