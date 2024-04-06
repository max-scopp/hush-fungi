import { log } from "electron-log";
import { Server, createServer } from "http";
import {
  APP_INTERNAL_HOST,
  APP_INTERNAL_PORT,
  APP_INTERNAL_SERVER_ADRESS,
} from "../../shared/constants";
import { handleRequest } from "./handleRequest";

let server: Server = null;

export async function createAppServer() {
  if (server) return;

  server = createServer(handleRequest);

  server.listen(APP_INTERNAL_PORT, APP_INTERNAL_HOST, () =>
    log(`app server: ${APP_INTERNAL_SERVER_ADRESS}`),
  );
}
