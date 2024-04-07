import { webFrame } from "electron";
import { log } from "electron-log";
import { STORE_HASS_AUTH } from "../shared/constants";
import { store } from "./store";

webFrame.setZoomFactor(18 / 20);

const externalAppHandler = {
  getExternalAuth(payload: string) {
    const { callback, force = false } = JSON.parse(payload);
    setTimeout(async () => {
      const auth = await store.get(STORE_HASS_AUTH);

      (window[callback] as any)(true, auth);
    });
    return true;
  },
  externalBus(message: string) {
    setTimeout(() => {
      const messageContent = JSON.parse(message) as MessageFormat;

      log("from hass bus:", messageContent);

      const hassHookEvt = `hass-hook:${messageContent.type}`;
      dispatchEvent(new CustomEvent(hassHookEvt, { detail: messageContent }));
      log("dispatched " + hassHookEvt);

      switch (messageContent.type) {
        case "config/get": {
          window.externalBus({
            id: messageContent.id,
            type: "result",
            success: true,
            result: {
              hasSettingsScreen: true,
              canWriteTag: false,
            },
          });
          break;
        }
        default:
          window.externalBus({
            id: messageContent.id,
            type: "result",
            success: false,
            error: {
              code: "69",
              message: "Not implemented",
            },
          });
      }
    });
  },
};

window.externalApp = externalAppHandler;
