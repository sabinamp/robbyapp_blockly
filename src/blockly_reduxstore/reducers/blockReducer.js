import { LOAD_BLOCKS, ADD_BLOCK, DELETE_BLOCK, SAVE_BLOCK } from '../actionTypes';

const initialState = {
  blocks: [{ block_name: '', block_xml: '', block_steps: [{ left: 0, right: 0 }] }]
}
const blockReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_BLOCKS:
      return action.results || [];

    case ADD_BLOCK:
      return [
        ...state.blocks,
        action.block
      ]
    case NAME_BLOCK:
      return [
        ...state.blocks,
        action.name
      ]
    default:
      return state.blocks;
  }
};   
