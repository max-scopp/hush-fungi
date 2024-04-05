import { HassConnectionPhase } from "./hass/HassConnectionPhase";

declare global {
  var localServerAddress: string;

  /**
   * TODO: Move me to HassConnection member const
   */
  var hassConnectionPhase: HassConnectionPhase;
}

export {};
