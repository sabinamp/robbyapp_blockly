import { combineReducers } from 'redux'
import speedReducer from './speedReducer'
import blockReducer from './blockReducer'

const rootReducer = combineReducers({
  Steps: speedReducer,
  Block: blockReducer
})

export default rootReducer
