/**
 * Shared list of channels used for ipc talk
 */
export const channels = {
  WANTS_WINDOW_HIDE: "ehs_wants_window_hide",
  SYSTEM_PREFERENCES_CHANGED: "ehs_system_preferences_changed",

  HASS_RECONNECT: "hass_reconnect",
  HASS_RECONNECTED: "hass_reconnected",
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
