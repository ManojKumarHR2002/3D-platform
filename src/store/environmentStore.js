import { create } from 'zustand';

export const useEnvironmentStore = create((set) => ({
  mode: 'hdri',
  hdriOption: 'studio',
  skyboxOption: 'sunny',
  setMode: (mode) => set({ mode }),
  setHdriOption: (option) => set({ hdriOption: option }),
  setSkyboxOption: (option) => set({ skyboxOption: option }),
}));
