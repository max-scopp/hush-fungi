import { filterObject } from "../../Common/filterObject";
import { useHassStore } from "../internal/useHassStore";

export function useEntities(allOrOnlyIds: "all" | string[]) {
  const entities = useHassStore((state) => {
    if (allOrOnlyIds === "all") {
      return state.entities;
    }

    return filterObject(state.entities, (entity) =>
      allOrOnlyIds.includes(entity.entity_id),
    );
  });

  return { entities };
}
