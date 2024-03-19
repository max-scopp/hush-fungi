import Logger from "electron-log";
import { logError } from "electron-unhandled";
import { UpdateCheckResult, autoUpdater } from "electron-updater";

let update: UpdateCheckResult = null;

async function checkForUpdatesAsync() {
  update = await autoUpdater.checkForUpdates();
}

export async function createAutoUpdater() {
  checkForUpdatesAsync().catch(logError);
}

export async function configureAutoUpdater() {
  Logger.transports.file.level = "info";
  autoUpdater.logger = Logger;
}
