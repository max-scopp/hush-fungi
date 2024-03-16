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
  };
}
