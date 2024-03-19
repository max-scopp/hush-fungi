import { app } from "electron";
import path from "path";
import { resolveHtmlPath } from "./helpers/resolveHtmlPath";

export const DEBUG =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

export const APP_GLOBAL_SHORTCUT = "Shift+Alt+F";

export const APP_STORE_USER_RECT = "lastUserState";
export const APP_STORE_TRAY_RECT = "lastTrayState";

export const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, "assets")
  : path.join(__dirname, "../../assets");

export const MAIN_WINDOW_START_URL = resolveHtmlPath(
  `${MAIN_WINDOW_VITE_NAME}/index.html`,
);

export const TRAY_ICON_PATH = path.resolve(
  `${__dirname}/../../assets/tray.png`,
);
