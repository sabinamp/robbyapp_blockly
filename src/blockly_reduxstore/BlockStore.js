import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import reducers from './reducers'

const logger = createLogger({
  colors: false,
  duration: false,
  timestamp: true
  // ...options
});

const block_store = createStore(reducers, applyMiddleware(logger));
export default block_store
