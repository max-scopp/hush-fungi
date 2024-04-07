import { BrowserWindow, nativeTheme, systemPreferences } from "electron";
import { log } from "electron-log";
import { readFileSync } from "fs";
import debounce from "lodash.debounce";
import { channels } from "../../shared/channels";
import { HASS_HOOK_PATH } from "../constants";

const hookJs = readFileSync(HASS_HOOK_PATH).toString();

export async function injectStyleableSystemPreferences(window: BrowserWindow) {
  let lastInjectId: string | null = null;

  const updateCss = async () => {
    if (lastInjectId) {
      await window.webContents.removeInsertedCSS(lastInjectId);
    }

    log(
      `(main) inject system preferences into window ${window.id} "${window.title}"`,
    );

    window.webContents.executeJavaScript(`(() => {${hookJs}})()`);

    lastInjectId = await window.webContents.insertCSS(`

      html,body {
        background-color: transparent !important;
        --primary-background-color: none;
        --lovelace-background: none;
        --ha-view-sections-column-max-width: 600px;
        --header-height: 45px;

        --app-header-text-color: var(--primary-text-color);
      }

    @media screen and (prefers-color-scheme: light) {
      
      html, body {
        text-shadow: 1px 1px 2px hsl(0deg 0% 100% / 8%);

        --app-header-background-color: hsl(0deg 0% 100% / 30%);

        --card-background-color: hsl(0deg 0% 100% / 30%);
        --divider-color: hsl(0deg 0% 0% / 0%);
      }
    }

    @media screen and (prefers-color-scheme: dark) {
      
      html, body {
        text-shadow: 1px 1px 2px hsl(0deg 0% 0% / 14%);
        
        --app-header-background-color: hsl(0deg 0% 0% / 50%);

        --card-background-color: hsl(0deg 0% 0% / 42%);
      }
    }

    [platform=darwin]:root {
      --divider-color: hsl(0deg 0% 0% / 0%);
      --ha-card-border-radius: 20px;
      --mush-chip-border-radius: 20px;

      --ha-view-sections-row-gap: 15px;
      --ha-section-grid-row-gap: 10px;
      --ha-section-grid-column-gap: 10px
    }

    [platform=win32]:root {
      --divider-color: hsl(0deg 0% 0% / 20%);
      --ha-card-border-radius: 10px;
      --mush-chip-border-radius: 5px;

      --ha-view-sections-row-gap: 15px;
      --ha-section-grid-row-gap: 10px;
      --ha-section-grid-column-gap: 10px
    }

      /*
      ::-webkit-scrollbar {
          width: 0.4rem;
          height: 0.4rem;
      }

      ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: var(--scrollbar-thumb-color);
      }*/
        `);
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
