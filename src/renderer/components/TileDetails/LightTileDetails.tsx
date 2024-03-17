import Meta from "antd/es/card/Meta";
import { HassEntity } from "home-assistant-js-websocket";
import { useCallback } from "react";
import { useHass } from "../../modules/Hass/useHass";
import { EntityIconButton } from "../EntityIconButton";
import { Slider } from "../Slider";

export function LightTileDetails({ entity }: { entity: HassEntity }) {
  const hass = useHass();

  const handleIconStateToggle = useCallback(
    (entity: HassEntity) => {
      hass.callService("light", "toggle", {}, { entity_id: entity.entity_id });
    },
    [entity],
  );

  return (
    <>
      <Meta
        avatar={
          <EntityIconButton entity={entity} onClick={handleIconStateToggle} />
        }
        title={entity.attributes.friendly_name}
        description={entity.state}
      />
      {entity.attributes.supported_color_modes.includes("color_temp") ? (
        <Slider />
      ) : null}
      {entity.attributes.supported_color_modes.includes("rgb") ? (
        <Slider />
      ) : null}
    </>
  );
}
