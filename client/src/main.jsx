import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux"
import {configureStore} from "@reduxjs/toolkit"
import authReducer from './state/index.js';
import{
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig={key:"auth",storage,version:1}
const persistedReducer= persistReducer(persistConfig,authReducer)
const store=configureStore({
  reducer:{auth:persistedReducer},
  middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck:{
      ignoreActions:[FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)