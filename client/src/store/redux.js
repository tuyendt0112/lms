import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSilice';
import pitchSlice from './pitch/pitchSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist'
import userSlice from './user/userSlice';

const commonConfig = {
  key: 'pitch/user',
  storage
}
const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token']
}
export const store = configureStore({
  reducer: {
    app: appSlice,
    pitch: pitchSlice,
    user: persistReducer(userConfig, userSlice)
  },

});
export const persistor =  persistStore(store)
