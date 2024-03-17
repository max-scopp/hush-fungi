import { IpcMainEvent, ipcMain } from "electron";
import { log } from "electron-log";
import {
  Auth,
  Connection,
  HassServiceTarget,
  callService,
  createConnection,
  subscribeConfig,
  subscribeEntities,
  subscribeServices,
} from "home-assistant-js-websocket";
import { channels } from "../../shared/channels";
import { HassConnectionPhase } from "./HassConnectionPhase";
import { hassAuth } from "./hassAuth";
import { hassUrl } from "./hassUrl";
Object.assign(global, { WebSocket: require("ws") });

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

    this.recoverAsync().catch(log);
  }

  static _phase: HassConnectionPhase = "unknown";

  publishNewPhase(phase: HassConnectionPhase) {
    log(`Publish new phase: ${phase}`);
    global.hassConnectionPhase = phase;
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
    log(`[HASS] fetch template with ${template.length} bytes`);

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
      `[HASS] template received in ${((performance.now() - start) * 1_000).toFixed(2)}ms`,
    );

    if (treatAsJson) {
      return response.json();
    }

    return response.text() as any;
  }

  async recoverAsync() {
    if (!hassUrl.isHassKnown()) {
      log("[HASS] dont recover - hass not known yet");
      this.publishNewPhase("hass-not-known");
      return;
    }

    log("[HASS] recover auth");
    this._auth = await hassAuth.getAuth();

    if (!this._auth) {
      log("[HASS] no auth to recover");
      this.publishNewPhase("failed-auth");
      return;
    }

    log("[HASS] ws: connecting...");
    this.connection = await createConnection({
      auth: this._auth,
      setupRetry: 3,
    });
    this.publishNewPhase("connected");
    this.onConnected();
    log("[HASS] ws: connected!");
  }

  private onConnected() {
    subscribeConfig(this.connection, (config) => {
      global.hassConfig = config;
    });

    subscribeServices(this.connection, (services) => {
      global.hassServices = services;
    });

    subscribeEntities(this.connection, (entities) => {
      global.hassEntities = entities;
    });

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
      async (event: IpcMainEvent, template: string, treatAsJson?: boolean) => {
        return this.template(template, treatAsJson);

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
