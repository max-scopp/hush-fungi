import { BrowserWindow } from "electron";
import { SETTINGS_WINDOW_START_URL } from "../constants";
import { buildDefaultWindowOptions } from "./buildDefaultWindowOptions";

export let companionSettings: BrowserWindow = null;

export const showCompanionSettingsWindow = async () => {
  // await app.whenReady();
  if (companionSettings && !companionSettings.isDestroyed()) {
    companionSettings.show();
    companionSettings.focus();
    return;
  }

  companionSettings = new BrowserWindow({
    ...buildDefaultWindowOptions("long"),
    show: true,
    maximizable: false,
    minimizable: false,

    width: 1200,
    height: 800,
  });

  companionSettings.loadURL(SETTINGS_WINDOW_START_URL);
  companionSettings.webContents.openDevTools({ mode: "detach" });

  companionSettings.on("closed", () => {
    companionSettings = null;
  });
};
