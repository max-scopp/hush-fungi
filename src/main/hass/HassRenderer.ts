import { log } from "electron-log";
import { Auth, Connection } from "home-assistant-js-websocket";

export class HassRenderer {
  constructor(
    readonly connection?: Connection,
    readonly auth?: Auth,
  ) {}

  async initAuth() {}

  private get hassUrl() {
    // get the hassUrl from the established connection rather than
    // what the app stored in case the user just switched in before
    // re-establishing / restarting the app.
    return this.auth.data.hassUrl;
  }

  private get templateUrl() {
    return new URL("api/template", this.hassUrl);
  }

  async template<R extends boolean>(
    template: string,
    tryParseAsJson?: R,
  ): Promise<object | string> {
    log(`[HASS] fetch template with ${template.length} bytes`);

    const start = performance.now();
    const response = await fetch(this.templateUrl, {
      method: "POST",
      body: JSON.stringify({ template }),
      headers: {
        Authorization: `Bearer ${this.auth.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    log(
      `[HASS] template received in ${((performance.now() - start) * 1_000).toFixed(2)}ms`,
    );

    if (tryParseAsJson) {
      return response.json();
    }

    return response.text() as any;
  }
}
