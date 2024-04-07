import {
  applyTheme,
  argbFromHex,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import { log } from "electron-log";

export function setSystemTheme() {
  const theme = themeFromSourceColor(
    argbFromHex(window.osAccentColor.substring(0, 6)),
  );
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  log("we got theme", theme);

  applyTheme(theme, { target: document.body, dark: systemDark });
}
