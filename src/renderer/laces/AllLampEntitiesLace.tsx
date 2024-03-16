import { Tile } from "../components/Tile";
import { useHassEntities } from "../modules/Hass/useHassEntities";

export function AllLampEntitiesLace() {
  const { lights } = useHassEntities();

  return (
    <>
      {Object.values(lights).map((entity) => (
        <Tile entity={entity} />
      ))}
    </>
  );
}
