import {
  ADD_STEP, REMOVE_ALL, UPDATE_ALL
} from '../actionTypes'

const initialState = {
  speeds: [{ left: 0, right: 0 }]
}

const speedReducer = (state = initialState, action) => {
  switch (action.type) {

    case ADD_STEP:
      return Object.assign({}, state.speeds, {
        speeds: [
          ...state.speeds,
          {
            left: action.left,
            right: action.right
          }
        ]
      });


    case REMOVE_ALL:
      return {
        speeds: [
          ...state.speeds.splice(0, speeds.length)]
      };

    case UPDATE_ALL:
      return Object.assign(...state.speeds, action.speeds);

    default:
      return state.speeds
  }
}

export default speedReducer
