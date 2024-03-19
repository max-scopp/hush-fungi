import { BrowserWindowConstructorOptions } from "electron";
import path from "path";
import { getAssetPath } from "../helpers/getAssetPath";
import { getTitlebarOverlayStyles } from "../helpers/getTitlebarOverlayStyles";

export function buildDefaultWindowOptions(
  howLongDoesTheWindowExist: "temporary" | "long",
): BrowserWindowConstructorOptions {
  return {
    autoHideMenuBar: true,
    center: true,
    show: false,
    minWidth: 300,
    minHeight: 120,
    width: 800,
    height: 600,
    icon: getAssetPath("icon.png"),
    titleBarStyle: "hidden",
    titleBarOverlay: getTitlebarOverlayStyles(),
    vibrancy: howLongDoesTheWindowExist === "long" ? "fullscreen-ui" : "sheet",

    backgroundMaterial:
      howLongDoesTheWindowExist === "long" ? "mica" : "acrylic",

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // must be `true` for @electron/remote cant move away from it yet.
      nodeIntegration: true,
    },
  };
}
