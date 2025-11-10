// src/store/slices/SceneSlice.js

import { createSlice } from "@reduxjs/toolkit";
import Model from "@src/classes/Model";
import { v4 as uuidv4 } from "uuid";

// ✅ Initial state now includes `sceneInstance`
const initialState = {
  objects: [],              // List of added 3D objects
  selectedObjectId: null,   // Currently selected object
  sceneInstance: null,      // Reference to the Three.js Scene wrapper
};

const sceneSlice = createSlice({
  name: "scene",
  initialState,
  reducers: {
    addObject(state, action) {
      const { name, url, parentId, position, rotation, scale, properties } = action.payload;
      const newModel = new Model(uuidv4(),name, url, position, rotation, scale, properties);
      state.objects.push({
        id: newModel.id,
        name,
        modelInstance: newModel,
        parentId: parentId || null,
      });
    },

    setParent(state, action) {
      const { childId, parentId } = action.payload;
      const obj = state.objects.find(o => o.id === childId);
      if (obj) obj.parentId = parentId;
    },

    selectObject(state, action) {
      state.selectedObjectId = action.payload;
    },

    updateTransform(state, action) {
      const { id, position, rotation, scale } = action.payload;
      const obj = state.objects.find(o => o.id === id);
      if (obj && obj.modelInstance) {
        if (position) obj.modelInstance.setPosition(position);
        if (rotation) obj.modelInstance.setRotation(rotation);
        if (scale) obj.modelInstance.setScale(scale);
      }
    },

    removeObject(state, action) {
      const idToRemove = action.payload;
      state.objects = state.objects.filter(o => o.id !== idToRemove);
    },

    // ✅ New reducer: Set the Three.js scene instance
    setSceneInstance(state, action) {
      state.sceneInstance = action.payload;
    },
  },
});

export const {
  addObject,
  setParent,
  selectObject,
  updateTransform,
  removeObject,
  setSceneInstance,
} = sceneSlice.actions;

export default sceneSlice.reducer;
