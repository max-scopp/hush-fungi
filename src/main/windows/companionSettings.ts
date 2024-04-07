import { BrowserWindow } from "electron";
import { SETTINGS_WINDOW_START_URL } from "../constants";
import { buildDefaultWindowOptions } from "./buildDefaultWindowOptions";

export let companionSettings: BrowserWindow = null;

export const showCompanionSettingsWindow = async () => {
  // await app.whenReady();
  if (companionSettings) {
    companionSettings.show();
    companionSettings.focus();
    return;
  }

  companionSettings = new BrowserWindow({
    ...buildDefaultWindowOptions("long"),
    maximizable: false,
    minimizable: false,

    maxWidth: 450,
    maxHeight: 1_200,

    width: 450,
    height: 800,
  });

  companionSettings.loadURL(SETTINGS_WINDOW_START_URL);
  companionSettings.show();
  companionSettings.webContents.openDevTools({ mode: "detach" });

  companionSettings.on("closed", () => {
    companionSettings = null;
  });
};
