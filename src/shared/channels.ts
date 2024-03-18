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

  HASS_CONFIG_CHANGED: "hass_config_changed",
  HASS_SERVICES_CHANGED: "hass_services_changed",
  HASS_ENTITIES_CHANGED: "hass_entities_changed",

  HASS_GET_CONFIG: "hass_get_config",
  HASS_GET_SERVICES: "hass_get_services",
  HASS_GET_ENTITIES: "hass_get_entities",
} as const;

export type Channels = typeof channels;
export type Channel = Channels[keyof Channels];
