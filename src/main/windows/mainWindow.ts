import { enable } from "@electron/remote/main";
import { BrowserWindow, Rectangle, app, ipcMain, shell } from "electron";
import { log } from "electron-log";
import { channels } from "../../shared/channels";
import { STORE_HASS_URL } from "../../shared/constants";
import {
  APP_STORE_TRAY_RECT,
  APP_STORE_USER_RECT,
  MAIN_WINDOW_START_URL,
} from "../constants";
import { injectStyleableSystemPreferences } from "../helpers/injectStylableSystemPreferences";
import { store } from "../store";
import { buildDefaultWindowOptions } from "./buildDefaultWindowOptions";

export let mainWindow: BrowserWindow = null;
type MainWindowMode = "user" | "tray";

const windowState = {
  lastUserRect: store.get(APP_STORE_USER_RECT) ?? {},
  lastTrayRect: store.get(APP_STORE_TRAY_RECT) ?? {},
  mode: "user" as MainWindowMode,
};

export function updateMainWindowRect(rect: Partial<Rectangle>) {
  switch (windowState.mode) {
    case "user": {
      Object.assign(windowState.lastUserRect, rect);
      store.set(APP_STORE_USER_RECT, windowState.lastUserRect);
      return;
    }
    case "tray": {
      Object.assign(windowState.lastTrayRect, rect);
      store.set(APP_STORE_TRAY_RECT, windowState.lastTrayRect);
      return;
    }
  }
}

export function updateMainWindowMode(newMode: MainWindowMode) {
  windowState.mode = newMode;

  switch (windowState.mode) {
    case "tray":
      mainWindow.setBounds(windowState.lastTrayRect, true);
      break;
    case "user":
      mainWindow.setBounds(windowState.lastUserRect, true);
      break;
  }
}

export function focusMainWindow(
  origin: "tray" | "protocol" | "shortcut",
  withRect?: Partial<Rectangle>,
) {
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  let futureMode: MainWindowMode = "user";

  switch (origin) {
    case "protocol":
    case "shortcut": {
      futureMode = "user";
      break;
    }
    case "tray": {
      futureMode = "tray";
      break;
    }
  }

  if (withRect) {
    updateMainWindowRect(withRect);
  }

  updateMainWindowMode(futureMode);

  mainWindow.show();
  mainWindow.focus();
}

export const createMainWindow = async () => {
  await app.whenReady();

  mainWindow = new BrowserWindow({
    ...buildDefaultWindowOptions("temporary"),
    frame: false,
    titleBarStyle: "default",
    titleBarOverlay: false,

    maximizable: false,
    minimizable: false,

    maxWidth: 600,
    maxHeight: 1_000,

    width: 460,
    height: 728,
  });

  // TODO: Remove @electron/remote
  enable(mainWindow.webContents);

  mainWindow.loadURL(MAIN_WINDOW_START_URL);

  mainWindow.on("move", () => updateMainWindowRect(mainWindow.getBounds()));
  mainWindow.on("resize", () => updateMainWindowRect(mainWindow.getBounds()));

  //#region hide content when inactive for windows animations
  ipcMain.on(channels.WANTS_WINDOW_HIDE, (event, windowId) => {
    if (windowId === mainWindow.id) {
      mainWindow.hide();
    }
  });

  const hideWindow = async () => {
    mainWindow.webContents.send(channels.WANTS_WINDOW_HIDE);
  };
  //#endregion

  mainWindow.on("blur", () => {
    if (mainWindow.webContents.isDevToolsOpened()) {
      log("Does not hide window because devtools are open");
      return;
    }

    hideWindow();
  });

  mainWindow.on("ready-to-show", () => {
    updateMainWindowRect(mainWindow.getBounds());

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      const knowsHass = store.get(STORE_HASS_URL);
      if (!knowsHass) {
      }
      mainWindow.show();
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }
  });

  injectStyleableSystemPreferences(mainWindow);

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  mainWindow.webContents.on("will-navigate", (event) => {
    const nonElectronUrl = !event.url.startsWith(MAIN_WINDOW_START_URL);
    if (nonElectronUrl) {
      shell.openExternal(event.url);
      event.preventDefault();

      return { action: "deny" };
    }
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createMainWindow();
    focusMainWindow("protocol");
  });
};
