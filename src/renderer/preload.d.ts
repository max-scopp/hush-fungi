import { ElectronHandler, HassHandler } from "../main/preload";

declare global {
  interface Window {
    electron: ElectronHandler;
    hass: HassHandler;
  }
}

export {};
