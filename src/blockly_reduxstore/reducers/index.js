import { combineReducers } from 'redux'
import speedReducer from './speedReducer'
import blockReducer from './blockReducer'
import { persistStore, persistReducer } from 'redux-persist';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  Steps: speedReducer,
  Block: blockReducer
})
const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  applyMiddleware(
    createLogger(),
  ),
);
const persistor = persistStore(store);

export { store, persistor }
