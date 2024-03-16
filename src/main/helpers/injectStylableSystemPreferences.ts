import { BrowserWindow, nativeTheme, systemPreferences } from "electron";
import { log } from "electron-log";
import { debounce } from "throttle-debounce";
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
        `);
  };

  // on windows, when changing themes, colors and light modes may trigger multiple times,
  // to make sure we do less work, we will debounce these event triggers.
  const handleChange = debounce(
    100,
    async () => {
      await updateCss();
      window.webContents.send(channels.SYSTEM_PREFERENCES_CHANGED);
    },
    { atBegin: true },
  );

  // when the user changed only a color
  systemPreferences.on("color-changed", handleChange);

  // when the user switches dark/light modes
  nativeTheme.on("updated", handleChange);

  updateCss();

  window.webContents.on("did-navigate", () => updateCss());
}
