import { HassEntity } from "home-assistant-js-websocket";

/**
 * Card details must handle the entity, however,
 * each individual kind of card detail can have their own
 * configuration.
 */
export type CardDetailsProps<Props = object> = Props & {
  entity: HassEntity;
};
