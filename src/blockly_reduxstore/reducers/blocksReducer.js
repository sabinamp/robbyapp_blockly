import { LOAD_BLOCKS, ADD_BLOCK, GET_BLOCK, REMOVE_BLOCK, UPDATE_BLOCK } from '../actionTypes';



//const initialState = [{ blockid: 0, block_name: 'Empty Workspace', block_xml: '', block_steps: [{ left: 0, right: 0 }] }];
const initialState = [];
const blocksReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BLOCK: {
      return Object.assign([], state.concat(action.block));
    }
    case GET_BLOCK:
      return state.filter(block => {
        return block.block_name === action.block_name
      });

    case REMOVE_BLOCK:
      return state.filter(block => {
        return block.block_name !== action.block_name
      });

    case LOAD_BLOCKS:
      return Object.assign([], state);

    case UPDATE_BLOCK: {
      let blockToUpdate = state.filter(block => {
        return block.block_name === action.block.block_name
      });
      let idToUpdate = blockToUpdate.id;
      /*    //delete the previous block with the same name and add a new one with different name
         return Object.assign([], state,[state.slice(0, idToUpdate),
         state.slice(idToUpdate + 1, state.length), block]); */
      let stateB = Object.assign([], state);
      return stateB.splice(idToUpdate, 1, action.block);
    }
    default: return state;
  }
};


export default blocksReducer;