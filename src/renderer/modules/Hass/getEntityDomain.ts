import { HassEntity } from "home-assistant-js-websocket";

const REGEXP_MATCH_DOMAIN = /^[^.]+/;

export function getEntityDomain(entityOrEntityId: HassEntity | string) {
  if (typeof entityOrEntityId === "string") {
    return entityOrEntityId.match(REGEXP_MATCH_DOMAIN)[0];
  }

  return entityOrEntityId.entity_id.match(/^[^.]+/)[0];
}
