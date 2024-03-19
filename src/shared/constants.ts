export const STORE_HASS_AUTH = "haAuth";
export const STORE_HASS_URL = "haUrl";
export const DEFAULT_HASS_URL = "http://homeassistant.local:8123";

export const APP_PROTOCOL_NAME = "hush-fungi";
export const APP_INTERNAL_HOST = "127.0.0.1";
export const APP_INTERNAL_PORT = 7862;
export const APP_INTERNAL_SERVER_ADRESS = new URL(
  `http://${APP_INTERNAL_HOST}:${APP_INTERNAL_PORT}/`,
).toString();
