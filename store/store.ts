import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Sử dụng localStorage
import authReducer from './slices/authReducer';

const persistConfig = {
   key: 'root',
   storage,
   whitelist: ['auth'], // Chỉ persist reducer 'auth'
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
   reducer: {
      auth: persistedReducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
         },
      }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
