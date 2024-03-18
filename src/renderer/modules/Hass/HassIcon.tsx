import { mdiLightbulb } from "@mdi/js";
import Icon from "@mdi/react";
import { HassEntity } from "home-assistant-js-websocket";
import { getEntityDomain } from "./getEntityDomain";
import { hassIcons } from "./hassIcons";

export function HassIcon({
  entity,
  iconName,
}: {
  entity?: HassEntity;
  iconName?: string;
}) {
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

export function defaultIconForDomain(entity: HassEntity) {
  const domain = getEntityDomain(entity);

  switch (domain) {
    case "light":
      return mdiLightbulb;
    default:
      return "";
    // return mdiHelp;
  }
}
