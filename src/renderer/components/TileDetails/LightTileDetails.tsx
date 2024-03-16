import { HassEntity } from "home-assistant-js-websocket";

export function LightTileDetails({ entity }: { entity: HassEntity }) {
  return <>light: {entity.entity_id}</>;
}
