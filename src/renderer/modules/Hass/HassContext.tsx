import { Auth, Connection, HassEntities } from "home-assistant-js-websocket";
import { createContext } from "react";

type HassState = {
  hassUrl: string;
  isConnected: boolean;
  entities: HassEntities;
  getConnection: () => Connection;
  getAuth: () => Auth;
};

export const HassContext = createContext<HassState>(null!);
