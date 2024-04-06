import { BrowserWindow, nativeTheme, systemPreferences } from "electron";
import { log } from "electron-log";
import { readFileSync } from "fs";
import debounce from "lodash.debounce";
import { channels } from "../../shared/channels";
import { HASS_HOOK_PATH } from "../constants";

const hookJs = readFileSync(HASS_HOOK_PATH).toString();

export async function injectStyleableSystemPreferences(window: BrowserWindow) {
  const lastInjectId: string | null = null;

  const updateCss = async () => {
    if (lastInjectId) {
      await window.webContents.removeInsertedCSS(lastInjectId);
    }

    log(
      `(main) inject system preferences into window ${window.id} "${window.title}"`,
    );

    await window.webContents.executeJavaScript(`
        global.osAccentColor = "#${systemPreferences.getAccentColor()}";
    `);
    window.webContents.executeJavaScript(`(() => {${hookJs}})()`);

    // lastInjectId = await window.webContents.insertCSS(`
    //     html,body {
    //       background-color: transparent !important;
    //       text-shadow: 1px 1px 2px hsl(0deg 0% 0% / 14%);

    //       --primary-background-color: none;
    //       --lovelace-background: none;
    //       --app-header-background-color: hsl(0deg 0% 0% / 50%);

    //       --ha-view-sections-column-max-width: 600px;

    //       --card-background-color: hsl(0deg 0% 0% / 42%);
    //       --divider-color: hsl(0deg 0% 0% / 0%);

    //       /* macos */
    //       --ha-card-border-radius: 20px;
    //       --mush-chip-border-radius: 20px;

    //       --ha-view-sections-row-gap: 15px;
    //       --ha-section-grid-row-gap: 10px;
    //       --ha-section-grid-column-gap: 10px

    //     }

    //     :root, html > body, home-assistant, ha-panel-lovelace {
    //       --primary-color: ${sysAccentClr.toStringHexRGB()};
    //       --rgb-primary-color: ${[sysAccentClr.r, sysAccentClr.g, sysAccentClr.b]};
    //       --text-primary-color: ${compAccentForegroundClr.toStringHexRGB()};
    //       --rgb-text-primary-color: ${[compAccentForegroundClr.r, compAccentForegroundClr.g, compAccentForegroundClr.b]};

    //       --paper-item-icon-color: ${sysAccentClr.toStringHexRGBA()};

    //       --state-icon-color: ${sysAccentClr.toStringHexRGBA()};
    //       --rgb-state-icon-color: ${[sysAccentClr.r, sysAccentClr.g, sysAccentClr.b]};

    //       --light-primary-color: ${compAccentClrLight.toStringHexRGB()};
    //       --rgb-light-primary-color: ${[compAccentClrLight.r, compAccentClrLight.g, compAccentClrLight.b]};
    //       --text-light-primary-color: ${compAccentLightForegroundClr.toStringHexRGB()};
    //       --rgb-text-light-primary-color: ${[compAccentLightForegroundClr.r, compAccentLightForegroundClr.g, compAccentLightForegroundClr.b]};

    //       --dark-primary-color: ${compAccentClrDark.toStringHexRGB()};
    //       --rgb-dark-primary-color: ${[compAccentClrDark.r, compAccentClrDark.g, compAccentClrDark.b]};
    //       --text-dark-primary-color: ${compAccentDarkForegroundClr.toStringHexRGB()};
    //       --rgb-text-dark-primary-color: ${[compAccentDarkForegroundClr.r, compAccentDarkForegroundClr.g, compAccentDarkForegroundClr.b]};
    //     }

    //   /*
    //   ::-webkit-scrollbar {
    //       width: 0.4rem;
    //       height: 0.4rem;
    //   }

    //   ::-webkit-scrollbar-thumb {
    //     border-radius: 4px;
    //     background: var(--scrollbar-thumb-color);
    //   }*/
    //     `);
  };

  // on windows, when changing themes, colors and light modes may trigger multiple times,
  // to make sure we do less work, we will debounce these event triggers.
  const handleChange = debounce(async () => {
    await updateCss();
    window.webContents.send(channels.SYSTEM_PREFERENCES_CHANGED);
  }, 100);

  // when the user changed only a color
  systemPreferences.on("color-changed", handleChange);

  // when the user switches dark/light modes
  nativeTheme.on("updated", handleChange);

  updateCss();

  window.webContents.on("did-navigate", () => updateCss());
}
