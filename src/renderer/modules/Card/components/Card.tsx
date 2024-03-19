import { Card as AntdCard } from "antd";
import { log } from "electron-log";
import { HassEntity } from "home-assistant-js-websocket";
import { ReactNode } from "react";
import { LightEntityCardDetails } from "../../CardDetails/components/LightEntityCardDetails";
import { getEntityDomain } from "../../Hass/helpers/getEntityDomain";
import { Domain } from "../../Hass/types/Domain";
import { CardDetailsProps } from "../types/CardDetailsProps";

type CardDetailMap = {
  [detail in Domain]: (props: CardDetailsProps) => ReactNode;
};

const cardDetailMap: CardDetailMap = {
  light: ({ entity }) => <LightEntityCardDetails entity={entity} />,
};

type CardProps = {
  entity: HassEntity;
  enforcedTileDetail?: keyof typeof cardDetailMap;
};

/**
 * A Card visually reflects the state of the given HASS entity and optionally
 * shows controls to change the entity's state.
 *
 * TODO: The controls should be customizable for the user. Fallback to all sensible controls if none provided.
 */
export function Card({ entity, enforcedTileDetail }: CardProps) {
  const CardDetail =
    cardDetailMap[enforcedTileDetail ?? getEntityDomain(entity)];

  return (
    <AntdCard size="small" bordered={false} onContextMenu={() => log(entity)}>
      <CardDetail entity={entity} />
    </AntdCard>
  );
}
