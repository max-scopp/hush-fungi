import { STORE_HASS_URL } from "../../shared/constants";
import { store } from "../store";

export const hassUrl = {
  isHassKnown() {
    return Boolean(store.get(STORE_HASS_URL));
  },
  getUrl() {
    return store.get(STORE_HASS_URL) as string;
  },
};
