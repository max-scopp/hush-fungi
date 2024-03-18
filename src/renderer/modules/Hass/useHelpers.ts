import { HassEntities } from "home-assistant-js-websocket";
import { filterObject } from "../Common/filterObject";
import { getEntityDomain } from "./getEntityDomain";

export function useHelpers() {
  return {
    getGroups(domain: string, entities: HassEntities) {
      return filterObject(entities, (entity) => {
        if (getEntityDomain(entity) === domain) {
          return "entity_id" in entity.attributes;
        }

        return false;
      });
    },
  };
}
