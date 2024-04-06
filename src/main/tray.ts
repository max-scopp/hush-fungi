import { Menu, Tray, app, screen } from "electron";
import { TRAY_ICON_PATH } from "./constants";
import { osPlatform } from "./helpers/osPlatform";
import { stuffsMenu } from "./menu/stuffsMenu";
import {
  focusMainWindow,
  mainWindow,
  updateMainWindowMode,
} from "./windows/mainWindow";

export let tray: Tray = null;

export async function createTray() {
  if (tray) return;

  await app.whenReady();

  tray = new Tray(TRAY_ICON_PATH);
  tray.setToolTip("This is my application.");
  tray.on("click", async (_event, tray, _cursor) => {
    updateMainWindowMode("tray");

    // TODO: Bad
    const offset = 10;
    const mainWindowBounds = mainWindow.getBounds();
    const display = screen.getDisplayMatching(tray);
    // TODO: Can I use floating-ui for this computation? Or similiar library?

    focusMainWindow("tray", {
      x: osPlatform.isMac
        ? tray.x + tray.width / 2 - mainWindowBounds.width / 2
        : display.bounds.width - mainWindowBounds.width - offset,
      y: tray.y - mainWindowBounds.height - offset,
    });
    // mainWindow.setBackgroundMaterial("acrylic");
  });

  if (!osPlatform.isMac) {
    const contextMenu = Menu.buildFromTemplate(stuffsMenu);

    tray.setContextMenu(contextMenu);
  }
}
