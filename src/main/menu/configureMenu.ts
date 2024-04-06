import { Menu, app, dialog } from "electron";
import { focusMainWindow, mainWindow } from "../windows/mainWindow";
import { stuffsMenu } from "./stuffsMenu";

export async function configureMenu() {
  await app.whenReady();

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "HushFungi",
        submenu: [
          {
            label: "About HushFungi",
            click() {
              focusMainWindow("protocol");
              dialog.showMessageBox(mainWindow, { message: "TODO" });
            },
          },
        ],
      },
      {
        label: "Window",
        submenu: stuffsMenu,
      },
    ]),
  );
}
