import { safeStorage } from "electron";
import { Auth, AuthData } from "home-assistant-js-websocket";
import { STORE_HASS_AUTH } from "../../shared/constants";
import { store } from "../store";
import { hassUrl } from "./hassUrl";

export const hassAuth = {
  storeAuth(data: AuthData) {
    const buffer = safeStorage.encryptString(JSON.stringify(data));
    store.set(STORE_HASS_AUTH, buffer.toString("latin1"));
  },

  discardAuth() {
    store.delete(STORE_HASS_AUTH);
  },

  /**
   * Can only be called when the electron app is ready!
   */
  async getAuth() {
    const lastAuthDataEncrypted = store.get(STORE_HASS_AUTH) as any;

    if (!lastAuthDataEncrypted) {
      return null;
    }

    // const lastAuthData = JSON.parse(
    //   safeStorage.decryptString(Buffer.from(lastAuthDataEncrypted, "latin1")),
    // );

    return new Auth({
      ...lastAuthDataEncrypted,
      hassUrl: hassUrl.getUrl(),
    });
  },
};
