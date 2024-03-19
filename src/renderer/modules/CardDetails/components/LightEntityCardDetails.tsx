import { Flex } from "antd";
import Meta from "antd/es/card/Meta";
import { HassEntity } from "home-assistant-js-websocket";
import { useCallback } from "react";
import { CardDetailsProps } from "../../Card/types/CardDetailsProps";
import { EntityIconButton } from "../../Common/components/EntityIconButton";
import { Slider } from "../../Slider/components/Slider";

export function LightEntityCardDetails({ entity }: CardDetailsProps) {
  const handleIconStateToggle = useCallback(
    (entity: HassEntity) => {
      window.hass.callService(
        "light",
        "toggle",
        {},
        { entity_id: entity.entity_id },
      );
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
      <Flex vertical gap="10px" style={{ marginTop: "10px" }}>
        <Slider
          type="brightness"
          value={entity.attributes.brightness ?? 0}
          entity_id={entity.entity_id}
        />
        {entity.attributes.supported_color_modes.includes("color_temp") ? (
          <Slider
            type="temperature"
            value={entity.attributes.color_temp_kelvin}
            entity_id={entity.entity_id}
          />
        ) : null}
        {entity.attributes.supported_color_modes.includes("rgb") ? (
          <Slider
            type="rgb"
            value={entity.attributes.rgb_color}
            entity_id={entity.entity_id}
          />
        ) : null}
        {entity.attributes.supported_color_modes.includes("rgbw") ? (
          <Slider
            type="rgbw"
            value={entity.attributes.rgbw_color}
            entity_id={entity.entity_id}
          />
        ) : null}
        {entity.attributes.supported_color_modes.includes("rgbww") ? (
          <Slider
            type="rgbww"
            value={entity.attributes.rgbww_color}
            entity_id={entity.entity_id}
          />
        ) : null}
      </Flex>
    </>
  );
}
