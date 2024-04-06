import { IncomingMessage, OutgoingMessage } from "http";
import { APP_INTERNAL_SERVER_ADRESS } from "../../shared/constants";
import { MAIN_WINDOW_START_URL } from "../constants";
import { mainWindow } from "../windows/mainWindow";

export function handleRequest(
  request: IncomingMessage,
  response: OutgoingMessage,
) {
  const url = new URL(request.url, APP_INTERNAL_SERVER_ADRESS);

  switch (true) {
    case url.searchParams.has("auth_callback") &&
      url.searchParams.has("code") &&
      url.searchParams.has("state"): {
      const startUrl = MAIN_WINDOW_START_URL;
      const params = /(\?.*$)/.exec(request.url)[0];

      const redirected = startUrl + params;

      mainWindow.webContents.loadURL(redirected);
      response.end(`<head>
          <meta http-equiv="Refresh" content="0; URL=hush-fungi://focus" />
          <script>setTimeout(() => close(), 300)</script>
        </head><body>You're done!</body>`);
      return;
    }
    default:
      response.end(`Nope.`);
  }
}
