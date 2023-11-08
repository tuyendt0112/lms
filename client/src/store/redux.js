import { configureStore } from '@reduxjs/toolkit';
import appSlice from './appSilice';

export const store = configureStore({
  reducer: {
    app: appSlice
  },

});
