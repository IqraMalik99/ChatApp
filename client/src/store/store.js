import { combineReducers, configureStore } from '@reduxjs/toolkit'
import SliceReducer from './reducer.js'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
const persistConfig = {
    key: 'root',
    storage,
  };
 let rootReducer =combineReducers({user:SliceReducer})
  const persistedReducer = persistReducer(persistConfig,rootReducer);
export const store = configureStore({
   reducer : persistedReducer
  // ,
  // middleware:(getDefaultMiddleware)=> getDefaultMiddleware({
  //   serializableCheck:false
  // })
});
export const persistor = persistStore(store);