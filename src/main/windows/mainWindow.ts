import { enable } from "@electron/remote/main";
import { BrowserWindow, app, nativeTheme, shell } from "electron";
import path from "path";
import { STORE_HASS_URL } from "../../shared/constants";
import { MAIN_WINDOW_START_URL } from "../constants";
import { getTitlebarOverlayStyles } from "../helpers/getTitlebarOverlayStyles";
import { injectStyleableSystemPreferences } from "../helpers/injectStylableSystemPreferences";
import { store } from "../store";

export let mainWindow: BrowserWindow = null;

export function focusMainWindow() {
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.show();
  mainWindow.focus();
}

export const createMainWindow = async () => {
  await app.whenReady();

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "assets")
    : path.join(__dirname, "../../assets");

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    maxWidth: 600,
    maxHeight: 1_000,
    width: 460,
    height: 728,
    icon: getAssetPath("icon.png"),
    titleBarStyle: "hidden",
    titleBarOverlay: getTitlebarOverlayStyles(),
    vibrancy: "fullscreen-ui",
    maximizable: false,
    minimizable: false,
    fullscreenable: false,

    autoHideMenuBar: true,
    backgroundMaterial: "acrylic",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // must be `true` for @electron/remote cant move away from it yet.
      nodeIntegration: true,
      // enableRemoteModule: true,
      // preload: app.isPackaged
      //   ? path.join(__dirname, "preload.js")
      //   : path.join(__dirname, "../../.erb/dll/preload.js"),
    },
  });

  // TODO: Remove @electron/remote
  enable(mainWindow.webContents);

  nativeTheme.on("updated", () => {
    mainWindow.setTitleBarOverlay(getTitlebarOverlayStyles());
  });

  mainWindow.loadURL(MAIN_WINDOW_START_URL);

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on("ready-to-show", () => {
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      const knowsHass = store.get(STORE_HASS_URL);
      if (!knowsHass) {
        mainWindow.show();
      }
    }
  });

  injectStyleableSystemPreferences(mainWindow);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

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
    focusMainWindow();
  });
};
