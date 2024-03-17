import {
  Auth,
  ERR_CANNOT_CONNECT,
  ERR_CONNECTION_LOST,
  ERR_HASS_HOST_REQUIRED,
  ERR_INVALID_AUTH,
  ERR_INVALID_AUTH_CALLBACK,
  ERR_INVALID_HTTPS_TO_HTTP,
  HassEntities,
  createConnection,
  createLongLivedTokenAuth,
  getAuth,
  subscribeEntities,
} from "home-assistant-js-websocket";
import { ReactNode, useEffect, useState } from "react";
import { suspend } from "suspend-react";
import { HassContext } from "./HassContext";

type HassProviderProps = {
  children: ReactNode;
};

export function HassProvider({ children }: HassProviderProps) {
  const { auth, connection } = suspend(async () => {
    if (!hassUrl) {
      return {};
    }

    try {
      console.log(`[HASS] using tokens`, hassTokens);
      const mockAuth = new Auth(hassTokens);

      const auth = await getAuth({
        hassUrl,
        loadTokens: async () => (mockAuth.expired ? null : hassTokens),
        saveTokens: async (data) =>
          window.electron.storage.set("hassTokens", data),
      });

      const longAuth = createLongLivedTokenAuth(hassUrl, auth.accessToken);

      const connection = await createConnection({ auth: longAuth });

      setTimeout(() => auth.refreshAccessToken(), auth.data.expires_in - 2e3);

      return { auth: longAuth, connection };
    } catch (err) {
      switch (err) {
        case ERR_CANNOT_CONNECT:
          throw new Error("[HASS] ws: Cannot connect");
        case ERR_INVALID_AUTH:
          throw new Error("[HASS] ws: Invalid auth");
        case ERR_CONNECTION_LOST:
          throw new Error("[HASS] ws: Connection lost");
        case ERR_HASS_HOST_REQUIRED:
          throw new Error("[HASS] ws: Host required");
        case ERR_INVALID_HTTPS_TO_HTTP:
          throw new Error("[HASS] ws: Invalid HTTPS to HTTP");
        case ERR_INVALID_AUTH_CALLBACK:
          throw new Error("[HASS] ws: Invalid auth callback");
        default:
          throw new Error("[HASS] ws: Connect connect: " + err);
      }
    }
  }, []);

  const [entities, setEntities] = useState<HassEntities>({});

  useEffect(() => {
    return subscribeEntities(connection, (entities) => {
      setEntities(entities);
    });
  }, [connection]);

  return (
    <HassContext.Provider
      value={{
        hassUrl,
        entities,
        isConnected: Boolean(connection),
        getConnection: () => connection,
        getAuth: () => auth,
      }}
    >
      {children}
    </HassContext.Provider>
  );
}
