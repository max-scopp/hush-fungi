import { log } from "electron-log";
import { DEBUG } from "../constants";
import { app } from "electron";

export async function installExtensions() {
  if (!DEBUG) {
    return;
  }

  await app.whenReady();

  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
  } = require("electron-devtools-installer");

  const installedExtensions = installExtension(REACT_DEVELOPER_TOOLS);

  log(`dev: installed extensions ${installedExtensions}`);
}
