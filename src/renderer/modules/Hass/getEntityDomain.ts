import { HassEntity } from "home-assistant-js-websocket";
import { Domain } from "./Domain";

const REGEXP_MATCH_DOMAIN = /^[^.]+/;

export function getEntityDomain(entityOrEntityId: HassEntity | string) {
  const entityId =
    typeof entityOrEntityId === "string"
      ? entityOrEntityId
      : entityOrEntityId.entity_id;

  return entityId.match(REGEXP_MATCH_DOMAIN)[0] as Domain;
}
