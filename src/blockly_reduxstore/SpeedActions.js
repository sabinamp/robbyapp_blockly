import {
  ADD_STEP, REMOVE_ALL, UPDATE_ALL
} from './actionTypes'

export function addStep(step) {
  return {
    type: 'ADD_STEP',
    step
  }
}




export function removeAll() {
  return {
    type: 'REMOVE_ALL'
  }
}


