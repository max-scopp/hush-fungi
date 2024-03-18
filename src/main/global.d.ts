import {
  HassConfig,
  HassEntities,
  HassServices,
} from "home-assistant-js-websocket";
import { HassConnectionPhase } from "./hass/HassConnectionPhase";

declare global {
  var localServerAddress: string;
  var hassConnectionPhase: HassConnectionPhase;
  /**
   * @deprecated
   */
  var hassConfig: HassConfig;
  /**
   * @deprecated
   */
  var hassServices: HassServices;
  /**
   * @deprecated
   */
  var hassEntities: HassEntities;
}

export {};
