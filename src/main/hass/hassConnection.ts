import { BrowserWindow, IpcMainEvent, ipcMain } from "electron";
import Logger, { log } from "electron-log";
import {
  Auth,
  Connection,
  HassServiceTarget,
  callService,
  configColl,
  createConnection,
  entitiesColl,
  servicesColl,
  subscribeConfig,
  subscribeEntities,
  subscribeServices,
} from "home-assistant-js-websocket";
import { Channel, channels } from "../../shared/channels";
import { HassConnectionPhase } from "./HassConnectionPhase";
import { hassAuth } from "./hassAuth";
import { hassUrl } from "./hassUrl";

globalThis.WebSocket = require("ws");

export class HassConnection {
  private static _instance: HassConnection;
  private _auth: Auth = null;
  connection: Connection = null;

  /**
   * Due to the auth encryption, you must init hass after the electron app
   * is ready to create it's first window.
   */
  static init() {
    if (!HassConnection._instance) {
      HassConnection._instance = new HassConnection();
    }

    return HassConnection._instance;
  }

  constructor() {
    if (HassConnection._instance) {
      throw new Error(
        "HassConnection is a singleton and cannot be created anymore.",
      );
    }

    this.reconnect();
    ipcMain.handle(channels.HASS_PHASE, () => global.hassConnectionPhase);
    ipcMain.on(channels.HASS_RECONNECT, () => this.reconnect());
  }

  private readonly reconnect = () => this.recoverAsync().catch(Logger.error);

  static _phase: HassConnectionPhase = "unknown";

  publishNewPhase(phase: HassConnectionPhase) {
    log(`Publish new phase: ${phase}`);
    global.hassConnectionPhase = phase;

    this.notifyAll(channels.HASS_PHASE, phase);
  }

  private get hassUrl() {
    // get the hassUrl from the established connection rather than
    // what the app stored in case the user just switched in before
    // re-establishing / restarting the app.
    return this._auth.data.hassUrl;
  }

  private get templateUrl() {
    return new URL("api/template", this.hassUrl);
  }

  async template(
    template: string,
    treatAsJson?: boolean,
  ): Promise<object | string> {
    log(`hass: fetch template with ${template.length} bytes`);

    const start = performance.now();
    const response = await fetch(this.templateUrl, {
      method: "POST",
      body: JSON.stringify({ template }),
      headers: {
        Authorization: `Bearer ${this._auth.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    log(
      `hass: template received in ${((performance.now() - start) / 1_000).toFixed(2)}ms`,
    );

    if (treatAsJson) {
      return response.json();
    }

    return response.text() as any;
  }

  async recoverAsync() {
    if (!hassUrl.isHassKnown()) {
      log("hass: dont recover - hass not known yet");
      this.publishNewPhase("hass-not-known");
      return;
    }

    log("hass: recover auth");
    this._auth = await hassAuth.getAuth();

    if (!this._auth) {
      log("hass: no auth to recover");
      this.publishNewPhase("failed-auth");
      return;
    }

    log("hass: ws: connecting...");
    this.connection = await createConnection({
      auth: this._auth,
      setupRetry: 3,
    });
    this.publishNewPhase("connected");
    this.onConnected();
    log("hass: ws: connected!");
  }

  private notifyAll(channel: Channel, ...args: any[]) {
    BrowserWindow.getAllWindows().forEach((window) =>
      window.webContents.send(channel, ...args),
    );
  }

  private onConnected() {
    //#region config
    subscribeConfig(this.connection, (config) => {
      this.notifyAll(channels.HASS_CONFIG_CHANGED, config);
    });

    ipcMain.handle(channels.HASS_GET_CONFIG, async (_event: IpcMainEvent) => {
      return configColl(this.connection).state;
    });
    //#endregion

    //#region services
    subscribeServices(this.connection, (services) => {
      this.notifyAll(channels.HASS_SERVICES_CHANGED, services);
    });

    ipcMain.handle(channels.HASS_GET_SERVICES, async (_event: IpcMainEvent) => {
      return servicesColl(this.connection).state;
    });
    //#endregion

    //#region entities
    subscribeEntities(this.connection, (entities) => {
      this.notifyAll(channels.HASS_ENTITIES_CHANGED, entities);
    });

    ipcMain.handle(channels.HASS_GET_ENTITIES, async (_event: IpcMainEvent) => {
      return entitiesColl(this.connection).state;
    });
    //#endregion

    ipcMain.on(
      channels.HASS_CALL_SERVICE,
      (
        _event,
        domain: string,
        service: string,
        serviceData?: object,
        target?: HassServiceTarget,
      ) => {
        callService(this.connection, domain, service, serviceData, target);
      },
    );

    ipcMain.handle(
      channels.HASS_RUN_TEMPLATE,
      async (_event: IpcMainEvent, template: string, treatAsJson?: boolean) => {
        return this.template(template, treatAsJson);

        // TODO: The below code should work, but I dont know why it doesnt
        // hass-frontend boils down to pretty much the same

        // const result = await this.connection.sendMessagePromise({
        //   type: "render_template",
        //   template,
        //   report_errors: true,
        // });

        // if (treatAsJson) {
        //   return JSON.parse(String(result));
        // }

        // return result;
      },
    );
  }
}
