import { Flex } from "antd";
import { InSafespace } from "../components/InSafespace";
import { RoomTitle } from "../components/RoomTitle";
import { Tile } from "../components/Tile";
import { useHassAreas } from "../modules/Hass/useHassAreas";
import { useHassEntities } from "../modules/Hass/useHassEntities";

export function AllLampEntitiesLace() {
  const { lights } = useHassEntities();
  const { areas, getEntitiesForArea } = useHassAreas();

  return (
    <Flex vertical>
      {areas.map((area) => {
        const areaEntities = getEntitiesForArea(area.id, ["light"]);

        if (!areaEntities.length) {
          return <></>;
        }

        return (
          <Flex vertical>
            <RoomTitle>{area.friendly_name}</RoomTitle>
            <InSafespace>
              <Flex vertical gap={10}>
                {areaEntities.map((entity) => (
                  <Tile entity={entity} />
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
