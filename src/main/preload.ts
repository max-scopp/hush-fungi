import { getGlobal } from "@electron/remote";
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import { Channel, channels } from "../shared/channels";
import { HassConnectionPhase } from "./hass/HassConnectionPhase";
import { HassConnection } from "./hass/hassConnection";
import { hassUrl } from "./hass/hassUrl";
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

ipcRenderer.on(
  channels.HASS_CHANGED_PHASE,
  (_event, phase) => (hassHandler.phase = phase),
);

const hassHandler = {
  isHassKnown() {
    return hassUrl.isHassKnown();
  },
  phase: HassConnection._phase,
  getUrl() {
    return hassUrl.getUrl();
  },
  reconnect() {
    ipcRenderer.send(channels.HASS_RECONNECT);
  },
  whenReady() {
    return new Promise((resolve) => {
      resolve(true);
      const whenReadyListener = (
        _event: IpcRendererEvent,
        phase: HassConnectionPhase,
      ) => {
        resolve(phase);
        ipcRenderer.off(channels.HASS_CHANGED_PHASE, whenReadyListener);
      };

      ipcRenderer.on(channels.HASS_CHANGED_PHASE, whenReadyListener);
    });
  },
};

contextBridge.exposeInMainWorld("electron", electronHandler);
contextBridge.exposeInMainWorld("hass", hassHandler);

export type ElectronHandler = typeof electronHandler;
export type HassHandler = typeof hassHandler;
