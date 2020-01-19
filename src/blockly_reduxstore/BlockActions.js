import {
  UPDATE_BLOCK, DELETE_BLOCK, ADD_BLOCK, RENAME_BLOCK, LOAD_BLOCKS
} from './actionTypes'


export function setBlockName(name) {
  return {
    type: 'RENAME_BLOCK',
    name
  }
}