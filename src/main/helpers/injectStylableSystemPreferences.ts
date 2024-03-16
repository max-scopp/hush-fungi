import { BrowserWindow, systemPreferences } from "electron";
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

  systemPreferences.on(
    "accent-color-changed",
    // windows triggers this 3x
    debounce(
      100,
      async () => {
        await updateCss();
        window.webContents.send(channels.ACCENT_COLOR_CHANGED);
      },
      { atBegin: true },
    ),
  );

  updateCss();

  window.webContents.on("did-navigate", () => updateCss());
}
