import { Menu, Tray, app, screen } from "electron";
import { TRAY_ICON_PATH } from "./constants";
import { osPlatform } from "./helpers/osPlatform";
import { focusMainWindow, mainWindow } from "./windows/mainWindow";

export let tray: Tray = null;

export async function createTray() {
  if (tray) return;

  await app.whenReady();

  tray = new Tray(TRAY_ICON_PATH);
  tray.setToolTip("This is my application.");
  tray.on("click", async (_event, tray, _cursor) => {
    // TODO: Bad
    const offset = 10;
    const mainWindowBounds = mainWindow.getBounds();
    const display = screen.getDisplayMatching(tray);

    // TODO: Can I use floating-ui for this computation? Or similiar library?
    mainWindow.setPosition(
      display.bounds.width - mainWindowBounds.width - offset,
      tray.y - mainWindowBounds.height - offset,
    );

    focusMainWindow();
    // mainWindow.setBackgroundMaterial("acrylic");
  });

  if (!osPlatform.isMac) {
    const contextMenu = Menu.buildFromTemplate([
      { label: "Quit", click: () => process.exit(1) },
    ]);

    tray.setContextMenu(contextMenu);
  }
}
