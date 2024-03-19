import { dialog } from "electron";
import { focusMainWindow } from "../windows/mainWindow";

/**
 * Supported urls:
 * - `hush-fungi://focus`
 */
export async function handleProtocolUrl(url: string) {
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
