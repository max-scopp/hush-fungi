import path from "path";
import { RESOURCES_PATH } from "../constants";

export function getAssetPath(...paths: string[]): string {
  return path.join(RESOURCES_PATH, ...paths);
}
