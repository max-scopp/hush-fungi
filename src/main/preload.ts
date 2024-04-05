import { getCurrentWindow, getGlobal } from "@electron/remote";
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import Logger, { log } from "electron-log";
import {
  HassConfig,
  HassEntities,
  HassServiceTarget,
  HassServices,
} from "home-assistant-js-websocket";
import { StateCreator } from "zustand";
import { browserEvents } from "../shared/browserEvents";
import { Channel, channels } from "../shared/channels";
import { HassConnectionPhase } from "./hass/HassConnectionPhase";
import { store } from "./store";

ipcRenderer.on(channels.WANTS_WINDOW_HIDE, () => {
  window.document.documentElement.setAttribute("inactive", "");
  // this is a bit wonky,
  // but the combination of setTimeout() 1 and requestAnimationFrame()
  // makes it more consistent that the next time the window is shown,
  // the first frame will NOT be the last frame before hiding.
  setTimeout(() => {
    requestAnimationFrame(() =>
      ipcRenderer.send(channels.WANTS_WINDOW_HIDE, getCurrentWindow().id),
    );
  }, 1);
});

window.addEventListener("focus", () => {
  window.document.documentElement.removeAttribute("inactive");
});

const electronHandler = {
  platform: process.platform,
  window: {
    blur() {
      getCurrentWindow().blur();
    },
  },
  storage: {
    get(key: string) {
      return store.get(key);
    },
    set(key: string, value: any) {
      return store.set(key, value);
    },
    has(key: string) {
      return store.has(key);
    },
    delete(key: string) {
      return store.delete(key);
    },
    async openEditor() {
      return store.openInEditor();
    },
  },
  remote: {
    /**
     * @deprecated I want to move away from @electron/remote
     */
    getGlobal(globalName: string) {
      const result = getGlobal(globalName);
      if (JSON.stringify(result).length > 500) {
        Logger.error(
          `getGlobal("${globalName}") in renderer communicated large data. Avoid it.`,
        );
      }
      return result;
    },
  },
  ipcRenderer: {
    sendMessage(channel: Channel, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channel, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channel, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

type EntitiesState = {
  config: HassConfig | null;
  services: HassServices;
  entities: HassEntities;
};

const phase: HassConnectionPhase = getGlobal("hassConnectionPhase");

const lazySync = (work: () => Promise<any>) => {
  if (phase === "connected") {
    work();
  }
};

const hassStoreCreator: StateCreator<EntitiesState> = (setState) => {
  //#region config
  ipcRenderer.on(channels.HASS_CONFIG_CHANGED, (_event, config) => {
    setState({ config });
  });

  lazySync(async () => {
    const config = await ipcRenderer.invoke(channels.HASS_GET_CONFIG);
    setState({ config });
  });
  //#endregion

  //#region services
  ipcRenderer.on(channels.HASS_SERVICES_CHANGED, (_event, services) => {
    setState({ services });
  });

  lazySync(async () => {
    const services = await ipcRenderer.invoke(channels.HASS_GET_SERVICES);
    setState({ services });
  });
  //#endregion

  //#region entities
  ipcRenderer.on(channels.HASS_ENTITIES_CHANGED, (_event, entities) => {
    setState({ entities });
  });

  lazySync(async () => {
    const entities = await ipcRenderer.invoke(channels.HASS_GET_ENTITIES);
    setState({ entities });
  });
  //#endregion

  return {
    config: null,
    services: {},
    entities: {},
  };
};

ipcRenderer.on(channels.HASS_RECONNECTED, () =>
  dispatchEvent(new CustomEvent(browserEvents.reconnected)),
);

ipcRenderer.on(channels.HASS_PHASE, (_, phase) =>
  dispatchEvent(
    new CustomEvent(browserEvents.reconnected, {
      detail: phase,
    }),
  ),
);

const hassHandler = {
  async getPhase() {
    return ipcRenderer.invoke(channels.HASS_PHASE);
  },
  reconnect() {
    ipcRenderer.send(channels.HASS_RECONNECT);
  },
  hassStoreCreator,
  callService(
    domain: string,
    service: string,
    serviceData?: object,
    target?: HassServiceTarget,
  ) {
    log(
      `(win ${getCurrentWindow().id}) hass: callService(${domain}, ${service}, ${JSON.stringify(serviceData)}, ${JSON.stringify(target)})`,
    );
    ipcRenderer.send(
      channels.HASS_CALL_SERVICE,
      domain,
      service,
      serviceData,
      target,
    );
  },
  async runTemplate<R = string | object>(
    template: string,
    options: { treatAsJson?: boolean },
  ): Promise<R> {
    return ipcRenderer.invoke(
      channels.HASS_RUN_TEMPLATE,
      template,
      options.treatAsJson,
    );
  },
};

contextBridge.exposeInMainWorld("electron", electronHandler);
contextBridge.exposeInMainWorld("hass", hassHandler);

export type ElectronHandler = typeof electronHandler;
export type HassHandler = typeof hassHandler;
