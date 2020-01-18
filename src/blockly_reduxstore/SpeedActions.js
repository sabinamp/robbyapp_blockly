import {
  ADD_STEP, REMOVE_ALL, UPDATE_ALL
} from './actionTypes'

export function addStep(step) {
  return {
    type: 'ADD_STEP',
    step
  }
}
export function setBlockName(name) {
  return {
    type: 'NAME_BLOCK',
    name
  }
}
export function insertStep(id, step) {
  return {
    type: 'INSERT_STEP',
    id,
    step
  }
}


export function removeAll() {
  return {
    type: 'REMOVE_ALL'
  }
}

export function replaceStep(id, step) {
  return {
    type: 'REPLACE_STEP',
    id,
    step
  }
}
