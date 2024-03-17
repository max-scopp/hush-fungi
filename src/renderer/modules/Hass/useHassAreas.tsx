import { suspend } from "suspend-react";
import { getEntityDomain } from "./getEntityDomain";
import { useHassEntities } from "./useHassEntities";

type AreaWithEntityIds = {
  id: string;
  friendly_name: string;
  entities: string[];
};

export function useHassAreas() {
  const { entities } = useHassEntities();
  const areas = suspend(
    async () =>
      window.hass.runTemplate<AreaWithEntityIds[]>(
        `[
      {% for area in areas() -%}
        {
          "id": {{ area | to_json }},
          "friendly_name": {{ area_name(area) | to_json }},
          "entities": {{ area_entities(area) | to_json }}
        }
        {% if not loop.last %},{% endif %}
      {%- endfor %}
    ]`,
        { treatAsJson: true },
      ),
    [],
  );

  return {
    areas,
    getEntitiesForArea(targetArea: string, onlyIncludeDomains?: string[]) {
      const areaWithEntityIds = areas.find((area) => area.id === targetArea);

      if (areaWithEntityIds) {
        const entityIdToEntity = (entityId: string) => entities[entityId];
        const entityIds = onlyIncludeDomains
          ? areaWithEntityIds.entities.filter((entityId) =>
              onlyIncludeDomains.includes(getEntityDomain(entityId)),
            )
          : areaWithEntityIds.entities;

        return entityIds
          .map(entityIdToEntity)
          .filter((entityFound: unknown) => Boolean(entityFound));
      }
    },
  };
}
