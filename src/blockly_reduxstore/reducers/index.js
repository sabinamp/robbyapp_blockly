import { combineReducers } from 'redux'
//import speedReducer from './SpeedReducer'
import blocksReducer from './blocksReducer'

const rootReducer = combineReducers({

  blocksReducer: blocksReducer
})

// Exports
export default rootReducer;