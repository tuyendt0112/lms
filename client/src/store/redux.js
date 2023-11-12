import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSilice';
import pitchSlice from './pitch/pitchSlice';

export const store = configureStore({
  reducer: {
    app: appSlice,
    pitch: pitchSlice
  },

});
