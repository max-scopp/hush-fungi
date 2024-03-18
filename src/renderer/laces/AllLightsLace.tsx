import { Flex } from "antd";
import { InSafespace } from "../components/InSafespace";
import { RoomTitle } from "../components/RoomTitle";
import { Tile } from "../components/Tile";
import { filterEntities } from "../modules/Common/filterEntities";
import { useAreas } from "../modules/Hass/useAreas";
import { useHassStore } from "../modules/Hass/useHassStore";

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
                  <Tile entity={entity} key={key} />
                ))}
              </Flex>
            </InSafespace>
          </Flex>
        );
      })}
    </Flex>
  );
}

// function groupByRooms(areas: any, entities: HassEntities)  {
//   const rooms = {}

//   Object.values(entities).forEach(entity => rooms[entity.context.])
// }
