import {
  blendOverlay,
  parseColor,
  parseColorHexRGBA,
  rgbToRelativeLuminance,
} from "@microsoft/fast-colors";
import { log } from "electron-log";

declare global {
  // eslint-disable-next-line no-var
  var osAccentColor: string;
}

export {};

const sysAccentClr = parseColorHexRGBA(osAccentColor);

window.addEventListener("hass-hook:theme-update", ({ detail }: CustomEvent) => {
  const compAccentForegroundClr =
    rgbToRelativeLuminance(sysAccentClr) <= 0.22
      ? parseColor("white")
      : parseColor("black");

  const compAccentClrLight = blendOverlay(
    sysAccentClr,
    parseColor("rgba(255, 255, 255, .12)"),
  );

  const compAccentLightForegroundClr =
    rgbToRelativeLuminance(compAccentClrLight) <= 0.22
      ? parseColor("white")
      : parseColor("black");

  const compAccentClrDark = blendOverlay(
    sysAccentClr,
    parseColor("rgba(0, 0, 0, .12)"),
  );

  const compAccentDarkForegroundClr =
    rgbToRelativeLuminance(compAccentClrDark) <= 0.22
      ? parseColor("white")
      : parseColor("black");

  const cssp = (propertyName: string, value: string | any[]) =>
    document.documentElement.style.setProperty(propertyName, String(value));

  cssp("--primary-color", sysAccentClr.toStringHexRGB());

  cssp("--primary-color", sysAccentClr.toStringHexRGB());
  cssp("--rgb-primary-color", [sysAccentClr.r, sysAccentClr.g, sysAccentClr.b]);
  cssp("--text-primary-color", compAccentForegroundClr.toStringHexRGB());
  cssp("--rgb-text-primary-color", [
    compAccentForegroundClr.r,
    compAccentForegroundClr.g,
    compAccentForegroundClr.b,
  ]);

  cssp("--paper-item-icon-color", sysAccentClr.toStringHexRGBA());

  cssp("--state-icon-color", sysAccentClr.toStringHexRGBA());
  cssp("--rgb-state-icon-color", [
    sysAccentClr.r,
    sysAccentClr.g,
    sysAccentClr.b,
  ]);

  cssp("--light-primary-color", compAccentClrLight.toStringHexRGB());
  cssp("--rgb-light-primary-color", [
    compAccentClrLight.r,
    compAccentClrLight.g,
    compAccentClrLight.b,
  ]);
  cssp(
    "--text-light-primary-color",
    compAccentLightForegroundClr.toStringHexRGB(),
  );
  cssp("--rgb-text-light-primary-color", [
    compAccentLightForegroundClr.r,
    compAccentLightForegroundClr.g,
    compAccentLightForegroundClr.b,
  ]);

  cssp("--dark-primary-color", compAccentClrDark.toStringHexRGB());
  cssp("--rgb-dark-primary-color", [
    compAccentClrDark.r,
    compAccentClrDark.g,
    compAccentClrDark.b,
  ]);
  cssp(
    "--text-dark-primary-color",
    compAccentDarkForegroundClr.toStringHexRGB(),
  );
  cssp("--rgb-text-dark-primary-color", [
    compAccentDarkForegroundClr.r,
    compAccentDarkForegroundClr.g,
    compAccentDarkForegroundClr.b,
  ]);

  log("Updated hass theme");
});
console.warn(`





=========================== 
ITS ME 3
=====================================



















`);
