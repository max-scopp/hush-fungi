import { mdiLightbulb } from "@mdi/js";
import Icon from "@mdi/react";
import { HassEntity } from "home-assistant-js-websocket";
import { getEntityDomain } from "../helpers/getEntityDomain";
import { hassIcons } from "../internal/hassIcons";

type HassIconProps = {
  entity?: HassEntity;
  iconName?: string;
};

function defaultIconForDomain(entity: HassEntity) {
  const domain = getEntityDomain(entity);

  switch (domain) {
    case "light":
      return mdiLightbulb;
    default:
      return "";
    // return mdiHelp;
  }
}

/**
 * Renders an hass icon string such as "mdi:fan".
 * Prefers to render the entity's icon if one is provided.
 */
export function HassIcon({ entity, iconName }: HassIconProps) {
  return (
    <Icon
      style={{ marginBottom: "-5px" }}
      path={
        entity
          ? hassIcons[entity.attributes.icon] || defaultIconForDomain(entity)
          : hassIcons[iconName]
      }
      size="var(--ehs-font-size-icon)"
    />
  );
}
