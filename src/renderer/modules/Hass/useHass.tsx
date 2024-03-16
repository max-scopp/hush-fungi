import { HassServiceTarget, callService } from "home-assistant-js-websocket";
import { useContext } from "react";
import { HassContext } from "./HassContext";

export function useHass() {
  const { hassUrl, isConnected, getConnection, getAuth } =
    useContext(HassContext);

  return {
    hassUrl,
    isConnected,
    get connection() {
      return getConnection();
    },
    get auth() {
      return getAuth();
    },
    callService(
      domain: string,
      service: string,
      serviceData?: object,
      target?: HassServiceTarget,
    ): Promise<unknown> {
      return callService(getConnection(), domain, service, serviceData, target);
    },
  };
}
