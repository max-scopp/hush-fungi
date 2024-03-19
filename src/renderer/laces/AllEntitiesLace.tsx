import { Flex, List, Tooltip } from "antd";
import { log } from "electron-log";
import { HassIcon } from "../modules/Hass/components/HassIcon";
import { useHassStore } from "../modules/Hass/internal/useHassStore";

export function AllEntitiesLace() {
  const { entities } = useHassStore();

  return (
    <>
      <h1 style={{ color: "HighlightText" }}>All Entities</h1>

      <List
        itemLayout="horizontal"
        size="small"
        dataSource={Object.values(entities)}
        renderItem={(entity) => (
          <Tooltip title={entity.entity_id} mouseEnterDelay={1}>
            <List.Item onClick={() => log(entity)}>
              <Flex gap="1ch">
                <HassIcon entity={entity} />
                {entity.attributes.friendly_name}
              </Flex>
            </List.Item>
          </Tooltip>
        )}
      />
    </>
  );
}
