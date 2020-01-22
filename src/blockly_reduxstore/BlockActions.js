import {
  UPDATE_BLOCK, REMOVE_BLOCK, ADD_BLOCK, GET_BLOCK, LOAD_BLOCKS
} from './actionTypes';

let nextBlockId = 0;
export const addBlock = (block) => ({
  type: ADD_BLOCK,
  block: {
    blockid: ++nextBlockId,
    block_name: "My Block" + nextBlockId,
    block_steps: block.block_steps,
    block_xml: block.block_xml
  }
});

export const removeBlock = (block_name) => ({
  type: REMOVE_BLOCK,
  block_name: block_name
});


export const loadBlocks = () => ({
  type: LOAD_BLOCKS,
});

export const updateBlock = (block) => ({
  type: UPDATE_BLOCK,
  block: block
});
export const getBlock = (block_name) => ({
  type: GET_BLOCK,
  block_name: block_name
});