// Imports: Redux
import rootReducer from './reducers';

import blocksReducer from './reducers/blocksReducer'
import { persistStore, persistReducer } from 'redux-persist';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
// Redux Persist Config
const persistConfig = {
  // Root?
  key: 'root',
  storage: AsyncStorage,
  // Whitelist (only persist the data from the blockReducer)
  whitelist: [
    'blockReducer',
  ],
  // Blacklist (Don't Save Specific Reducers)
  /*  blacklist: [
     'speedReducer',
   ], */
  stateReconciler: autoMergeLevel2,
}
// Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  applyMiddleware(
    createLogger(),
  ),
);
let persistor = persistStore(store);

export { store, persistor };