import { BrowserWindow, nativeTheme, systemPreferences } from "electron";
import { log } from "electron-log";
import debounce from "lodash.debounce";
import { channels } from "../../shared/channels";

export function injectStyleableSystemPreferences(window: BrowserWindow) {
  let lastInjectId: string | null = null;

  const updateCss = async () => {
    if (lastInjectId) {
      await window.webContents.removeInsertedCSS(lastInjectId);
    }

    log(
      `(main) inject system preferences into window ${window.id} "${window.title}"`,
    );
    lastInjectId = await window.webContents.insertCSS(`
            :root {
                --sys-accent-color: #${systemPreferences.getAccentColor()}
            }

            
        html,body {
          background-color: transparent !important;
          text-shadow: 1px 1px 2px hsl(0deg 0% 0% / 14%);
      
          --primary-background-color: none;
          --lovelace-background: none;
          --app-header-background-color: hsl(0deg 0% 0% / 50%);
      
          --ha-view-sections-column-max-width: 600px;
      
          --card-background-color: hsl(0deg 0% 0% / 42%);
          --divider-color: hsl(0deg 0% 0% / 0%);
      
          /* macos */
          --ha-card-border-radius: 20px;
          --mush-chip-border-radius: 20px;
      
          --ha-view-sections-row-gap: 15px;
          --ha-section-grid-row-gap: 10px;
          --ha-section-grid-column-gap: 10px
        }
      
        ::-webkit-scrollbar {
            width: 0.4rem;
            height: 0.4rem;
        }
      
        ::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background: var(--scrollbar-thumb-color);
        }
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
