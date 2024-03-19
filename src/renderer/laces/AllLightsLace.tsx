import { Flex } from "antd";
import { Card } from "../modules/Card/components/Card";
import { InSafespace } from "../modules/Common/components/InSafespace";
import { RoomTitle } from "../modules/Common/components/RoomTitle";
import { filterEntities } from "../modules/Common/filterEntities";
import { useAreas } from "../modules/Hass/hooks/useAreas";
import { useHassStore } from "../modules/Hass/internal/useHassStore";

export function AllLightsLace() {
  const lights = useHassStore((state) =>
    filterEntities(state.entities, "light"),
  );

  const { areas, getEntitiesForArea } = useAreas();

  return (
    <Flex vertical>
      {areas.map((area) => {
        const areaEntities = getEntitiesForArea(lights, area);
        const areaEntitiesKv = Object.entries(areaEntities);

        if (!areaEntitiesKv.length) {
          return <></>;
        }

        return (
          <Flex vertical>
            <RoomTitle>{area.friendly_name}</RoomTitle>
            <InSafespace>
              <Flex vertical gap={10}>
                {areaEntitiesKv.map(([key, entity]) => (
                  <Card entity={entity} key={key} />
                ))}
              </Flex>
            </InSafespace>
          </Flex>
        );
      })}
    </Flex>
  );
}
