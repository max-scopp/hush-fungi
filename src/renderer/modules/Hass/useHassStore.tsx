import { create } from "zustand";

export const useHassStore = create(window.hass.hassStoreCreator);
