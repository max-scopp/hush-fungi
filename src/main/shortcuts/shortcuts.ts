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

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered(APP_GLOBAL_SHORTCUT));

  app.on("will-quit", () => {
    // Unregister a shortcut.
    globalShortcut.unregister(APP_GLOBAL_SHORTCUT);

    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
  });
}
