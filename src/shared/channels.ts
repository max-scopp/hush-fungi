/**
 * Shared list of channels used for ipc talk
 */
export const channels = {
  QUIT: "ehs_quit",
  SYSTEM_PREFERENCES_CHANGED: "ehs_system_preferences_changed",
  START_MY_HASS_SETUP: "ehs_start_myhass_setup",
  REACT_LOADED: "ehs_react_loaded",
  MAIN_RESPOND_REACT_LOADED: "ehs_confirm_react_loaded",
  WS_CONNECTED: "ehs_ws_connected",

  // hass channels
  HASS_RECONNECT: "hass_reconnect",
  HASS_CALL_SERVICE: "hass_call_service",
  HASS_RUN_TEMPLATE: "hass_run_template",
} as const;

export type Channels = typeof channels;
export type Channel = Channels[keyof Channels];
