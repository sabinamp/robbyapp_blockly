import {
  ADD_STEP, REMOVE_ALL, UPDATE_ALL
} from '../actionTypes'

const initialState = {
  speeds: [{ left: 0, right: 0 }]
}

const speedReducer = (state = initialState, action) => {
  switch (action.type) {

    case ADD_STEP:
      return {
        ...state,
        speeds: [...state.speeds, action.payload],
      };


    case REMOVE_ALL:
      return {
        ...state,
        speeds: [
          ...state.speeds.splice(0, speeds.length)]
      };

    case UPDATE_ALL:
      return {
        ...state,
        speeds: Object.assign(...state.speeds, action.speeds)
      };
    default:
      return state.speeds
  }
}

export default speedReducer
