import Icon from "@mdi/react";
import { Flex, List, Tooltip } from "antd";
import { log } from "electron-log";
import { hassIcons } from "../modules/Common/hassIcons";
import { useHassEntities } from "../modules/Hass/useHassEntities";

export function AllEntitiesLace() {
  const { entities } = useHassEntities();

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
                <Icon
                  path={hassIcons[entity.attributes.icon]}
                  size="var(--ehs-font-size-icon)"
                />
                {entity.attributes.friendly_name}
              </Flex>
            </List.Item>
          </Tooltip>
        )}
      />
    </>
  );
}
