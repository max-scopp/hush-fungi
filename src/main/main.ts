/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main/main.js` using webpack. This gives us some performance wins.
 */
import Remote from "@electron/remote/main";
import { BrowserWindow, app, dialog, ipcMain, shell } from "electron";
import { log, default as logger } from "electron-log";
import ElectronStore from "electron-store";
import unhandled from "electron-unhandled";
import { autoUpdater } from "electron-updater";
import http from "http";
import path from "path";
import { channels } from "../shared/channels";
import {
  APP_INTERNAL_HOST,
  APP_INTERNAL_PORT,
  APP_PROTOCOL_NAME,
} from "../shared/constants";
import { HassConnection } from "./hass/hassConnection";
import { injectStyleableSystemPreferences } from "./helpers/injectStylableSystemPreferences";
import { isMac } from "./helpers/osPlatform";
import { resolveHtmlPath } from "./helpers/resolveHtmlPath";

class AppUpdater {
  constructor() {
    logger.transports.file.level = "info";
    autoUpdater.logger = logger;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on("ipc-example", async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply("ipc-example", msgTemplate("pong"));
});

const isDebug =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

if (isDebug) {
  require("electron-debug")();
}

const installExtensions = async () => {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
  } = require("electron-devtools-installer");

  return installExtension(REACT_DEVELOPER_TOOLS);
};

const MAIN_WINDOW_START_URL = resolveHtmlPath(
  `${MAIN_WINDOW_VITE_NAME}/index.html`,
);

const createWindow = async () => {
  if (isDebug) {
    const extensions = await installExtensions();
    logger.debug(`Installed extensions: ${extensions}`);
  }

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
    titleBarOverlay: {
      color: "black",
      symbolColor: "white",
      height: 30,
    },
    vibrancy: "fullscreen-ui",
    maximizable: false,
    minimizable: false,
    fullscreenable: false,

    autoHideMenuBar: true,
    backgroundMaterial: "mica",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // webSecurity: false,
      nodeIntegration: true,
      // enableRemoteModule: true,
      // preload: app.isPackaged
      //   ? path.join(__dirname, "preload.js")
      //   : path.join(__dirname, "../../.erb/dll/preload.js"),
    },
  });

  Remote.enable(mainWindow.webContents);

  const startUrl = MAIN_WINDOW_START_URL;
  mainWindow.loadURL(startUrl);

  mainWindow.on("ready-to-show", () => {
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

  mainWindow.webContents.on("will-navigate", (event) => {
    const nonElectronUrl = !event.url.startsWith(startUrl);
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

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (!isMac) {
    app.quit();
  }
});

ipcMain.on(channels.QUIT, () => app.quit());

logger.initialize();
unhandled();
ElectronStore.initRenderer();
HassConnection.init();
Remote.initialize();

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(APP_PROTOCOL_NAME, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient(APP_PROTOCOL_NAME);
}

if (isMac) {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  whenReadyCreateMainWindow();

  // Handle the protocol. In this case, we choose to show an Error Box.
  app.on("open-url", (event, url) => {
    handleProtocolUrl(url);
  });
} else {
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
    // TODO: Probably not good
    process.exit();
  } else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
      // TODO: Investiage if wanted on windows when shipping
      // // Someone tried to run a second instance, we should focus our window.
      // if (mainWindow) {
      //   focusMainWindow();
      // }
      // the commandLine is array of strings in which last element is deep link url
      handleProtocolUrl(commandLine.pop());
    });

    // Create mainWindow, load the rest of the app, etc...
    whenReadyCreateMainWindow();
  }
}

function focusMainWindow() {
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
}

function whenReadyCreateMainWindow() {
  app
    .whenReady()
    .then(() => {
      createWindow();

      app.on("activate", () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) createWindow();
      });
    })
    .catch(console.log);
}

// server configuration

// create the server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, global.localServerAddress);

  if (
    url.searchParams.has("auth_callback") &&
    url.searchParams.has("code") &&
    url.searchParams.has("state")
  ) {
    const startUrl = MAIN_WINDOW_START_URL;
    const params = /(\?.*$)/.exec(req.url)[0];

    const redirected = startUrl + params;

    mainWindow.webContents.loadURL(redirected);
    res.end(`<head>
    <meta http-equiv="Refresh" content="0; URL=hush-fungi://focus" />
    <script>setTimeout(() => close(), 300)</script>
  </head><body>You're done!</body>`);
    return;
  }

  res.end(`Noo peeking ;)`);
});

globalThis.localServerAddress = new URL(
  `http://${APP_INTERNAL_HOST}:${APP_INTERNAL_PORT}/`,
).toString();

// make the server listen to requests
server.listen(APP_INTERNAL_PORT, APP_INTERNAL_HOST, () => {
  log(`Server running at: ${globalThis.localServerAddress}`);
});

function handleProtocolUrl(url: string) {
  const { hostname } = new URL(url);
  switch (hostname) {
    case "focus":
      focusMainWindow();
      break;
    default:
      dialog.showErrorBox(
        "Protocol Failure",
        `No known action for "${hostname}"`,
      );
  }
}
