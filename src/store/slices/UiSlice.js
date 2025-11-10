import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    selectedObjectId: null,
  },
  reducers: {
    setSelectedObjectId: (state, action) => {
      state.selectedObjectId = action.payload;
    },
    clearSelectedObject: (state) => {
      state.selectedObjectId = null;
    },
  },
});

export const { setSelectedObjectId, clearSelectedObject } = uiSlice.actions;
export default uiSlice.reducer;
