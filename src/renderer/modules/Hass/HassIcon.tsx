import { mdiLightbulb } from "@mdi/js";
import Icon from "@mdi/react";
import { HassEntity } from "home-assistant-js-websocket";
import { getEntityDomain } from "./getEntityDomain";
import { hassIcons } from "./hassIcons";

export function HassIcon({ entity }: { entity: HassEntity }) {
  return (
    <Icon
      path={hassIcons[entity.attributes.icon] || defaultIconForDomain(entity)}
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
