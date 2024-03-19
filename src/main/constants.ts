import path from "path";
import { resolveHtmlPath } from "./helpers/resolveHtmlPath";

export const DEBUG =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

export const MAIN_WINDOW_START_URL = resolveHtmlPath(
  `${MAIN_WINDOW_VITE_NAME}/index.html`,
);

export const TRAY_ICON_PATH = path.resolve(
  `${__dirname}/../../assets/tray.png`,
);
