import { app } from "electron";
import { log } from "electron-log";
import { DEBUG } from "../constants";

export async function installExtensions() {
  if (!DEBUG) {
    return;
  }

  await app.whenReady();

  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
  } = require("electron-devtools-installer");

  const installedExtensions = await installExtension(REACT_DEVELOPER_TOOLS);

  log(`dev: installed extensions ${installedExtensions}`);
}
