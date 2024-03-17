import { filterObject } from "../Common/filterObject";

export function useHassEntities() {
  const entities = window.electron.remote.getGlobal("hassEntities");

  return {
    entities,
    get lights() {
      return filterObject(entities, (entity) =>
        entity.entity_id.startsWith("light."),
      );
    },
  };
}
