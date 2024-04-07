import { IncomingMessage, OutgoingMessage } from "http";
import { APP_INTERNAL_SERVER_ADRESS } from "../../shared/constants";

export function handleRequest(
  request: IncomingMessage,
  response: OutgoingMessage,
) {
  const url = new URL(request.url, APP_INTERNAL_SERVER_ADRESS);

  // focuses the application from the browser
  // response.end(`<head>
  //     <meta http-equiv="Refresh" content="0; URL=hush-fungi://focus" />
  //     <script>setTimeout(() => close(), 300)</script>
  //   </head><body>You're done!</body>`);

  switch (true) {
    default:
      response.end(``);
  }
}
