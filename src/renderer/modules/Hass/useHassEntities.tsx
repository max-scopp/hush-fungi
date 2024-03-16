import { useContext } from "react";
import { filterObject } from "../Common/filterObject";
import { HassContext } from "./HassContext";

export function useHassEntities() {
  const { entities } = useContext(HassContext);

  return {
    entities,
    get lights() {
      return filterObject(entities, (entity) =>
        entity.entity_id.startsWith("light."),
      );
    },
  };
}
