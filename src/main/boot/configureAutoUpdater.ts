import { default as logger } from "electron-log";
import { autoUpdater } from "electron-updater";

export async function configureAutoUpdater() {
  logger.transports.file.level = "info";
  autoUpdater.logger = logger;
}
