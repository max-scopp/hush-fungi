import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import { Channel } from "../shared/channels";
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

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
