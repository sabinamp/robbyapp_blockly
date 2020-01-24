import { LOAD_BLOCKS, ADD_BLOCK, GET_BLOCK, REMOVE_BLOCK, UPDATE_BLOCK } from '../actionTypes';



//const initialState = [{ blockid: 0, block_name: '', block_xml: '', block_steps: [{ left: 0, right: 0 }] }];
const initialState = [];
const blocksReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BLOCK:
      return Object.assign([], state.concat(action.block));
    case GET_BLOCK:
      return state.blocks.filter(block => {
        return block.block_name === action.block.block_name
      });
    case LOAD_BLOCKS:
      return Object.assign([], state);
    case REMOVE_BLOCK:
      return state.blocks.filter(block => {
        return block.block_name !== action.block.block_name
      });

    case UPDATE_BLOCK: {
      let blockToUpdate = state.blocks.filter(block => {
        return block.block_name === action.block.block_name
      });
      let idToUpdate = blockToUpdate.id;
      /*    //delete the previous block with the same name and add a new one with different name
         return Object.assign([], state,[state.slice(0, idToUpdate),
         state.slice(idToUpdate + 1, state.length), block]); */
      return Object.assign([], state.splice(idToUpdate, 1, action.block));
    }
    default: return state;
  }
};


export default blocksReducer;