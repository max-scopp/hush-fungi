import { Badge, Button } from "antd";
import { HassEntity } from "home-assistant-js-websocket";
import { HassIcon } from "../modules/Hass/HassIcon";

import { ExclamationCircleFilled } from "@ant-design/icons";
import { hassStates } from "../modules/Hass/hassStates";
import styles from "./EntityIconButton.module.scss";

export function EntityIconButton({
  entity,
  onClick,
}: {
  entity: HassEntity;
  onClick?: (entity: HassEntity) => void;
}) {
  return (
    <Badge
      count={
        entity.state === hassStates.UNAVAILABLE ? (
          <ExclamationCircleFilled
            style={{ color: "var(--ehs-color-warning)" }}
          />
        ) : null
      }
    >
      <Button
        className={styles["entity-icon-button"]}
        onClick={() => onClick(entity)}
        style={{}}
        type="text"
        shape="circle"
        icon={<HassIcon entity={entity} />}
      ></Button>
    </Badge>
  );
}
