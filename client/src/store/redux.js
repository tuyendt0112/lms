import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSilice';
import pitchSlice from './pitch/pitchSlice';
import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistReducer, persistStore } from 'redux-persist'
import userSlice from './user/userSlice';

const commonConfig = {
  key: 'pitch/user',
  storage
}
const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token', 'current']
}
export const store = configureStore({
  reducer: {
    app: appSlice,
    pitch: pitchSlice,
    user: persistReducer(userConfig, userSlice)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});
export const persistor = persistStore(store)
