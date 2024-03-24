import { app, globalShortcut } from "electron";
import { APP_GLOBAL_SHORTCUT } from "../constants";
import { focusMainWindow } from "../windows/mainWindow";

export async function configureGlobalShortcuts() {
  await app.whenReady();

  const ret = globalShortcut.register(APP_GLOBAL_SHORTCUT, () => {
    focusMainWindow("shortcut");
  });

  if (!ret) {
    console.log("registration failed");
  }

  app.on("will-quit", () => {
    globalShortcut.unregister(APP_GLOBAL_SHORTCUT);
  });
}
