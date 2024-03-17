import { log } from "electron-log";
import {
  Auth,
  Connection,
  createConnection,
} from "home-assistant-js-websocket";
import { HassConnectionPhase } from "./HassConnectionPhase";
import { HassRenderer } from "./HassRenderer";
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

  static getRenderer() {
    return new HassRenderer(
      HassConnection._instance?.connection,
      HassConnection._instance?._auth,
    );
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
    log("[HASS] ws: connected!");
  }
}
