import { HassEntities } from "home-assistant-js-websocket";
import { Domain } from "../Hass/types/Domain";
import { filterObject } from "./filterObject";

export function filterEntities(entities: HassEntities, domain: Domain) {
  return filterObject(entities, (entity) =>
    entity.entity_id.startsWith(`${domain}.`),
  );
}
