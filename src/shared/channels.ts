/**
 * Shared list of channels used for ipc talk
 */
export const channels = {
  SYSTEM_PREFERENCES_CHANGED: "ehs_system_preferences_changed",
  REACT_LOADED: "ehs_react_loaded",
  MAIN_RESPOND_REACT_LOADED: "ehs_confirm_react_loaded",
  WS_CONNECTED: "ehs_ws_connected",
} as const;

export type Channels = typeof channels;
export type Channel = Channels[keyof Channels];
