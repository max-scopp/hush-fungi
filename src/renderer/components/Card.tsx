import { Card as AntdCard } from "antd";
import { log } from "electron-log";
import { HassEntity } from "home-assistant-js-websocket";
import { ReactNode } from "react";
import { getEntityDomain } from "../modules/Hass/getEntityDomain";
import { LightTileDetails } from "./TileDetails/LightTileDetails";

const tileDetailMap: { [detail: string]: (entity: HassEntity) => ReactNode } = {
  light: (entity: HassEntity) => <LightTileDetails entity={entity} />,
};

export function Card({
  entity,
  enforcedTileDetail,
}: {
  entity: HassEntity;
  enforcedTileDetail?: keyof typeof tileDetailMap;
}) {
  const tileDetail =
    tileDetailMap[enforcedTileDetail ?? detectTileDetail(entity)];

  return (
    <AntdCard size="small" onClick={() => log(entity)} bordered={false}>
      {tileDetail(entity)}
    </AntdCard>
  );
}

function detectTileDetail(entity: HassEntity) {
  return getEntityDomain(entity);
}
