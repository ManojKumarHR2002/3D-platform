import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './UiSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
});

export default store;
