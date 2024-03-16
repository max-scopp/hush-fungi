import { Auth } from "home-assistant-js-websocket";
import { useEffect, useState } from "react";
import { getEntityDomain } from "./getEntityDomain";
import { useHass } from "./useHass";
import { useHassEntities } from "./useHassEntities";

type AreaWithEntityIds = {
  id: string;
  friendly_name: string;
  entities: string[];
};

export function useHassAreas() {
  const { connection, hassUrl, auth } = useHass();
  const { entities } = useHassEntities();
  const [areas, setAreas] = useState<AreaWithEntityIds[]>([]);

  useEffect(() => {
    const templateUrl = new URL("api/template", hassUrl);

    const doAsync = async () => {
      const areasAndEntities: AreaWithEntityIds[] = await fetch(
        templateUrl,
        buildTemplateInitRequest(
          auth,
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
        ),
      ).then((res) => res.json());

      setAreas(areasAndEntities);
    };

    doAsync();
  }, [connection]);

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

function buildTemplateInitRequest(auth: Auth, template: string): RequestInit {
  return {
    method: "POST",
    body: JSON.stringify({ template }),
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      "Content-Type": "application/json",
    },
  };
}

function parseTemplate(template: string) {
  return JSON.parse(template.replaceAll("'", '"')) as string[];
}
