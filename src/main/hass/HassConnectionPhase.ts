export type HassConnectionPhase =
  | "unknown"
  | "connected"
  | "disconnected"
  | "failed-auth"
  | "hass-not-known";
