import { Card } from "antd";
import { log } from "electron-log";
import { HassEntity } from "home-assistant-js-websocket";
import { ReactNode } from "react";
import { LightTileDetails } from "./TileDetails/LightTileDetails";

const tileDetailMap: { [detail: string]: (entity: HassEntity) => ReactNode } = {
  light: (entity: HassEntity) => <LightTileDetails entity={entity} />,
};

export function Tile({
  entity,
  enforcedTileDetail,
}: {
  entity: HassEntity;
  enforcedTileDetail?: keyof typeof tileDetailMap;
}) {
  const tileDetail =
    tileDetailMap[enforcedTileDetail ?? detectTileDetail(entity)];

  return <Card onClick={() => log(entity)}>{tileDetail(entity)}</Card>;
}

function detectTileDetail(entity: HassEntity) {
  return entity.entity_id.match(/^[^.]+/)[0];
}
