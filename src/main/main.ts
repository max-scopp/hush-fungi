import { ipcMain, systemPreferences } from "electron";
import { default as ElectronLog } from "electron-log";
import ElectronStore from "electron-store";
import unhandled, { logError } from "electron-unhandled";
import { configureSingleInstance } from "./boot/configureSingleInstance";
import { installExtensions } from "./dev/installExtensions";
import { configureMenu } from "./menu/configureMenu";
import { configureProtocol } from "./protocol/handleProtocolUrl";
import { createAppServer } from "./server/server";
import { configureGlobalShortcuts } from "./shortcuts/shortcuts";
import { createTray } from "./tray";
import { configureAutoUpdater, createAutoUpdater } from "./updates/updater";
import { createMainWindow } from "./windows/mainWindow";

/**
 * This module executes inside of electron's main process.
 * You can start electron renderer process from here and communicate
 * other processes through IPC.
 */
async function main() {
  // if (DEBUG) {
  //   require("electron-debug")();
  // }

  unhandled();
  ElectronLog.initialize();
  ElectronStore.initRenderer();

  await configureSingleInstance();
  await configureProtocol();
  await configureGlobalShortcuts();
  await configureMenu();
  await configureAutoUpdater();

  await Promise.all([
    createAutoUpdater(),
    createAppServer(),
    createTray(),
    installExtensions(),
  ]);

  ipcMain.handle("os-accent-color", () => systemPreferences.getAccentColor());

  await createMainWindow();
}

main().catch(logError);
