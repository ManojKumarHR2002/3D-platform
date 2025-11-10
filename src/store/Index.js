// src/store/index.js

import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/UiSlice';
import sceneReducer from './slices/sceneSlice'; // Make sure this path is correct

const store = configureStore({
  reducer: {
    ui: uiReducer,
    scene: sceneReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['scene/setSceneInstance'],
        ignoredPaths: ['scene.sceneInstance'],
      },
    }),
});

export default store;
