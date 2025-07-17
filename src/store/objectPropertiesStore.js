import { create } from "zustand";
import { useSelectedObjectStore } from "./selectedObjectStore";

export const useObjectPropertiesStore = create(() => ({
  updateProperty: (propType, axis, value) => {
    const selectedObject = useSelectedObjectStore.getState().selectedObject;
    if (!selectedObject) return;

    const current = selectedObject[propType];
    current[axis] = value;

    // Also store for reference
    selectedObject.userData.transform[propType][axis] = value;
  },
}));
