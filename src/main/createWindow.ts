import { BrowserWindow, app, shell } from "electron";
import log from "electron-log";
import path from "path";
import { injectStyleableSystemPreferences } from "./helpers/injectStylableSystemPreferences";
import { resolveHtmlPath } from "./helpers/resolveHtmlPath";
import { AppUpdater, installExtensions, isDebug, mainWindow } from "./main";

export const createWindow = async () => {
  if (isDebug) {
    log(`


    
    install extensions!!!
    
    
    `);
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "assets")
    : path.join(__dirname, "../../assets");

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath("icon.png"),
    // titleBarOverlay: true,
    vibrancy: "content",
    // frame: false,
    autoHideMenuBar: true,
    backgroundMaterial: "mica",
    minimizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      // preload: app.isPackaged
      //   ? path.join(__dirname, "preload.js")
      //   : path.join(__dirname, "../../.erb/dll/preload.js"),
    },
  });

  mainWindow.loadURL(resolveHtmlPath("index.html"));

  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  injectStyleableSystemPreferences(mainWindow);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();
  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};
