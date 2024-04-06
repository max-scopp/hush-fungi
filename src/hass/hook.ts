import {
  ColorHSL,
  hslToRGB,
  parseColor,
  parseColorHexRGBA,
  rgbToHSL,
  rgbToRelativeLuminance,
} from "@microsoft/fast-colors";
import { log } from "electron-log";

declare global {
  // eslint-disable-next-line no-var
  var osAccentColor: string;
}
export {};
const sysAccentClr = parseColorHexRGBA(osAccentColor);
const sysAccentClrHsl = rgbToHSL(sysAccentClr);
const sysAccentClrHslDark = hslToRGB(
  ColorHSL.fromObject({
    h: sysAccentClrHsl.h,
    s: sysAccentClrHsl.s - 0.05,
    l: sysAccentClrHsl.l + 0.22,
  }),
);
const sysAccentClrHslLight = hslToRGB(
  ColorHSL.fromObject({
    h: sysAccentClrHsl.h,
    s: sysAccentClrHsl.s,
    l: sysAccentClrHsl.l,
  }),
);

const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

const accentClrBase = isDarkMode ? sysAccentClrHslDark : sysAccentClr;
log(`we at dark mode??? ${isDarkMode}`);

window.addEventListener("hass-hook:theme-update", ({ detail }: CustomEvent) => {
  document.documentElement.setAttribute("platform", process.platform);
  const compAccentForegroundClr =
    rgbToRelativeLuminance(accentClrBase) <= 0.22
      ? parseColor("white")
      : parseColor("black");

  const compAccentLightForegroundClr =
    rgbToRelativeLuminance(sysAccentClrHslLight) <= 0.22
      ? parseColor("white")
      : parseColor("black");

  const compAccentDarkForegroundClr =
    rgbToRelativeLuminance(sysAccentClrHslDark) <= 0.22
      ? parseColor("white")
      : parseColor("black");

  /**
   * CSS Property set on document
   */
  const cssp = (propertyName: string, value: string | any[]) =>
    document.documentElement.style.setProperty(propertyName, String(value));

  /**
   * Open ShadowDOM CSS Overwrite
   */
  const osco = (selectors: string[], cssKV: [string, string]) => {
    const targetWC = selectors.reduce(
      (parent, currElm) => parent.shadowRoot.querySelector(currElm),
      document.body,
    );
    debugger;
    cssKV.forEach(([property, value]) =>
      targetWC.style.setProperty(property, value),
    );
  };

  cssp("--primary-color", accentClrBase.toStringHexRGB());

  cssp("--primary-color", accentClrBase.toStringHexRGB());
  cssp("--rgb-primary-color", [
    accentClrBase.r,
    accentClrBase.g,
    accentClrBase.b,
  ]);
  cssp("--text-primary-color", compAccentForegroundClr.toStringHexRGB());
  cssp("--rgb-text-primary-color", [
    compAccentForegroundClr.r,
    compAccentForegroundClr.g,
    compAccentForegroundClr.b,
  ]);

  cssp("--paper-item-icon-color", accentClrBase.toStringHexRGBA());

  cssp("--state-icon-color", accentClrBase.toStringHexRGBA());
  cssp("--rgb-state-icon-color", [
    accentClrBase.r,
    accentClrBase.g,
    accentClrBase.b,
  ]);

  cssp("--light-primary-color", sysAccentClrHslLight.toStringHexRGB());
  cssp("--rgb-light-primary-color", [
    sysAccentClrHslLight.r,
    sysAccentClrHslLight.g,
    sysAccentClrHslLight.b,
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

  cssp("--dark-primary-color", sysAccentClrHslDark.toStringHexRGB());
  cssp("--rgb-dark-primary-color", [
    sysAccentClrHslDark.r,
    sysAccentClrHslDark.g,
    sysAccentClrHslDark.b,
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

  setTimeout(() => {
    const headerDrag = document.createElement("style");
    headerDrag.append(`
      .header
      {
        -webkit-app-region: drag;
      }
      
      ha-menu-button,
      ha-button-menu,
      paper-tab,
      ha-icon-button-arrow-prev
      {
        -webkit-app-region: no-drag;
    
      }
    `);

    const sidebarUndrag = document.createElement("style");
    sidebarUndrag.append(`
    ha-sidebar
      {
        -webkit-app-region: no-drag;
      }
    `);

    document
      .querySelector("home-assistant")
      .shadowRoot.querySelector("home-assistant-main")
      .shadowRoot.querySelector("ha-drawer")
      .querySelector("ha-panel-lovelace")
      .shadowRoot.querySelector("hui-root")
      .shadowRoot.append(headerDrag);

    document
      .querySelector("home-assistant")
      .shadowRoot.querySelector("home-assistant-main")
      .shadowRoot.querySelector("ha-drawer")
      .append(sidebarUndrag);
  }, 1e3);

  log("Updated hass theme");
});
console.warn(`





=========================== 
ITS ME 3
=====================================



















`);
