import { getGlobal } from "@electron/remote";
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import { HassServiceTarget } from "home-assistant-js-websocket";
import { Channel, channels } from "../shared/channels";
import { store } from "./store";

const electronHandler = {
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
    getGlobal(globalName: string) {
      return getGlobal(globalName);
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

const hassHandler = {
  reconnect() {
    ipcRenderer.send(channels.HASS_RECONNECT);
  },
  callService(
    domain: string,
    service: string,
    serviceData?: object,
    target?: HassServiceTarget,
  ) {
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
