// src/store/objectStore.js
import { create } from "zustand";

export const useObjectStore = create((set, get) => ({
  objects: [],
  selectedObjectId: null,

  setObjects: (objects) => set({ objects }),

  setSelectedObjectId: (id) => set({ selectedObjectId: id }),

  addObject: (object) => set((state) => ({
    objects: [...state.objects, object],
  })),

  updateObject: (updatedObject) => {
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === updatedObject.id ? updatedObject : obj
      ),
    }));
  },

  deleteObject: async (id) => {
    // Remove from Supabase
    await supabase.from("objects").delete().eq("id", id);

    // Update local state
    set((state) => ({
      objects: state.objects.filter((obj) => obj.id !== id),
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
    }));
  },
}));
