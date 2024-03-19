import { app } from "electron";
import { error } from "electron-log";
import path from "path";
import { APP_PROTOCOL_NAME } from "../../shared/constants";
import { osPlatform } from "../helpers/osPlatform";
import { handleProtocolUrl } from "../protocol/handleProtocolUrl";

export async function configureProtocol() {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(APP_PROTOCOL_NAME, process.execPath, [
        path.resolve(process.argv[1]),
      ]);
    }
  } else {
    app.setAsDefaultProtocolClient(APP_PROTOCOL_NAME);
  }

  if (osPlatform.isMac) {
    app.on("open-url", (_event, url) => {
      handleProtocolUrl(url);
    });
  } else if (osPlatform.isWindows) {
    app.on("second-instance", (_event, commandLine, _workingDirectory) => {
      // on windows, a second instance with single instance lock usually
      // means to focus the main window, however, if and which window really
      // should be focused will be up to the protocol handler.
      handleProtocolUrl(commandLine.pop());
    });
  } else {
    error("protocol: platform not supported");
  }
}
