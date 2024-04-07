import { BrowserWindow, MenuItemConstructorOptions } from "electron";
import { store } from "../store";
import { buildDefaultWindowOptions } from "../windows/buildDefaultWindowOptions";
import {
  companionSettings,
  showCompanionSettingsWindow,
} from "../windows/companionSettings";
import { mainWindow } from "../windows/mainWindow";

export const stuffsMenu: MenuItemConstructorOptions[] = [
  {
    label: "Dismiss",

    accelerator: process.platform === "darwin" ? "Cmd+W" : "Ctrl+W",
    click(_menuItem, browserWindow, _event) {
      if (browserWindow.id === mainWindow.id) {
        browserWindow.hide();
      }
    },
  },
  { label: "Quit", click: () => process.exit(1) },
  {
    label: "Open Storage",
    click(_menuItem, browserWindow, _event) {
      store.openInEditor();
    },
  },
  {
    label: "Open Settings",
    async click(_menuItem, browserWindow, _event) {
      await showCompanionSettingsWindow();
    },
  },
  {
    label: "Empty Screen",
    click(_menuItem, browserWindow, _event) {
      const win = new BrowserWindow({
        ...buildDefaultWindowOptions("temporary"),

        height: 583,
        useContentSize: true,
        width: 480,
        titleBarStyle: "hiddenInset",
        frame: false,
        vibrancy: "fullscreen-ui",
        webPreferences: {
          experimentalFeatures: true,
        },
      });

      win.show();
    },
  },
  {
    label: "Open DevTools",
    accelerator:
      process.platform === "darwin" ? "Option+Cmd+I" : "Ctrl+Shift+I",
    click(_menuItem, browserWindow, _event) {
      mainWindow?.webContents.openDevTools({
        mode: "detach",
        activate: true,
      });
    },
  },
  {
    label: "Open Settings DevTools",
    click(_menuItem, browserWindow, _event) {
      companionSettings?.webContents.openDevTools({
        mode: "detach",
        activate: true,
      });
    },
  },
];
