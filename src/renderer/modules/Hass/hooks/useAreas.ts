import { HassEntities } from "home-assistant-js-websocket";
import { suspend } from "suspend-react";
import { filterObject } from "../../Common/filterObject";

type AreaWithEntityIds = {
  id: string;
  friendly_name: string;
  entities: string[];
};

export function useAreas() {
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
    getEntitiesForArea(entities: HassEntities, area: AreaWithEntityIds) {
      return filterObject(entities, (enitity) =>
        area.entities.includes(enitity.entity_id),
      );
    },
  };
}
