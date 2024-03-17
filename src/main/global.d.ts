import { HassConnectionPhase } from "./hass/HassConnectionPhase";

declare global {
  var localServerAddress: string;
  var hassConnectionPhase: HassConnectionPhase;
}

export {};
