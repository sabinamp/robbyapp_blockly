import { LOAD_BLOCKS, ADD_BLOCK, DELETE_BLOCK, UPDATE_BLOCK } from './actionTypes';

const initialState = {
  blocks: [{ block_name: '', block_xml: '', block_steps: [{ left: 0, right: 0 }] }]
}
const blockReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_BLOCKS:
      return action.results || [];

    case ADD_BLOCK:
      return {
        ...state,
        blocks: [...state.blocks, action.payload],
      };
    /*     
        case UPDATE_BLOCK:
          return { //todo
            ...state,
            blocks: [...state.blocks, state.blocks.filter(block => {
            return block.block_name === action.payload.block_name}).block_xml=action.payload.block_xml
            ],
            }; */
    case LOAD_BLOCKS:
      return {
        ...state,
        blocks: [...action.payload],
      };
    case DELETE_BLOCK:
      return {
        ...state,
        blocks: state.blocks.filter(block => {
          return block.block_name !== action.payload.block_name
        })
      };
    default:
      return state.blocks;
  }
};

export default blockReducer;
