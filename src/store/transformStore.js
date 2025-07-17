// src/store/transformStore.js
import { create } from 'zustand';

export const useTransformStore = create((set) => ({
  mode: 'translate', // 'rotate' or 'scale'
  setMode: (mode) => set({ mode }),
}));
