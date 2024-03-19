import { nativeTheme } from "electron";

export function getTitlebarOverlayStyles(): Electron.TitleBarOverlay {
  return nativeTheme.shouldUseDarkColors
    ? {
        color: "black",
        symbolColor: "white",
        height: 30,
      }
    : {
        color: "white",
        symbolColor: "black",
        height: 30,
      };
}
