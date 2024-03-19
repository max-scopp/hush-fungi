import { logError } from "electron-unhandled";
import { UpdateCheckResult, autoUpdater } from "electron-updater";

let update: UpdateCheckResult = null;

async function checkForUpdatesAsync() {
  update = await autoUpdater.checkForUpdates();
}

export async function createAutoUpdater() {
  checkForUpdatesAsync().catch(logError);
}
