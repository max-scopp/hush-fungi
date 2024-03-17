import {
  HassConfig,
  HassEntities,
  HassServices,
} from "home-assistant-js-websocket";
import { HassConnectionPhase } from "./hass/HassConnectionPhase";

declare global {
  var localServerAddress: string;
  var hassConnectionPhase: HassConnectionPhase;
  var hassConfig: HassConfig;
  var hassServices: HassServices;
  var hassEntities: HassEntities;
}

export {};
