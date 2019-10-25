import { Block, Program, ProgramType } from "../model/DatabaseModels";
var RobbyDatabaseAction = require('../database/RobbyDatabaseActions');

let loadedProgram = undefined;
let currentProgramName = "";
let pickerItems = [];
let blocks = [new Block("", 1)];
let blockChangeCallbacks = [];
let programNameChangeCallbacks = [];
let pickerItemsChangeCallbacks = [];
let loadedProgramChangeCallbacks = [];
let programsChangeCallbacks = [];

// Blocks

function add(block) {
    blocks.push(block);
    notifyBlockChangeListeners(blocks);
    return blocks;
}

function addAt(index, block) {
    blocks.splice(index, 0, block);
    notifyBlockChangeListeners();
}

function swap(old_index, new_index) {
    const oref = blocks[old_index].ref;
    const orep = blocks[old_index].rep;

    blocks[old_index].ref = blocks[new_index].ref;
    blocks[old_index].rep = blocks[new_index].rep;
    blocks[new_index].ref = oref;
    blocks[new_index].rep = orep;
    notifyBlockChangeListeners();
}

function remove(index) {
    blocks.splice(index, 1);
    notifyBlockChangeListeners();
}

function updateRepeatValue(index, new_repeat_value){
    blocks[index].rep = new_repeat_value;
    notifyBlockChangeListeners();
}

function updateBlock(index, block){
    blocks[index].ref = block;
    notifyBlockChangeListeners();
}

function removeAll() {
    blocks = [];
    notifyBlockChangeListeners();
}

function notifyBlockChangeListeners() {
    blockChangeCallbacks.forEach(listener => {
        listener(blocks);
    });
}

function addBlocksChangeListener(fn) {
    blockChangeCallbacks.push(fn);
}

// Program Name

function addProgramNameChangeListener(fn) {
    programNameChangeCallbacks.push(fn);
}

function notifyProgramNameChangeListeners() {
    programNameChangeCallbacks.forEach(listener => {
        listener(currentProgramName);
    });
}

function updateProgramName(name){
    currentProgramName = name;
    notifyProgramNameChangeListeners();
}


// Picker Items

function addPickerItemsChangeListener(fn) {
    pickerItemsChangeCallbacks.push(fn);
}

function notifyPickerItemsChangeListeners() {
    pickerItemsChangeCallbacks.forEach(listener => {
        listener(pickerItems);
    });
}

function refreshPickerItems(program) {
    if(program){
        pickerItems = RobbyDatabaseAction.findAllWhichCanBeAddedTo(program);
    }else{
        pickerItems = RobbyDatabaseAction.findAll();
    }
    notifyPickerItemsChangeListeners();
}

// Loaded Program

function addLoadedProgramChangeListener(fn) {
    loadedProgramChangeCallbacks.push(fn);
}

function notifyLoadedProgramChangeListeners() {
    loadedProgramChangeCallbacks.forEach(listener => {
        listener(loadedProgram);
    });
}

function loadProgramByName(name){
    loadedProgram = RobbyDatabaseAction.findOne(name);
    blocks = loadedProgram.blocks;
    currentProgramName = loadedProgram.name;
    
    refreshPickerItems(loadedProgram);
    notifyAll();
}

function clearBlocksProgram(){
    removeAll();
    add(new Block("",1));
    loadedProgram = undefined;
    currentProgramName = "";
    refreshPickerItems();
    notifyAll();
}

// Other

function notifyAll() {
    // TODO: Always keep up to date... 
    notifyLoadedProgramChangeListeners();
    notifyProgramNameChangeListeners();
    notifyLoadedProgramChangeListeners();
    notifyBlockChangeListeners();
    notifyPickerItemsChangeListeners();
    notifyProgramsChangeListeners();
}

function addBlocksProgramsChangeListener(fn){
    programsChangeCallbacks.push(fn);
}

function notifyProgramsChangeListeners(){
    programsChangeCallbacks.forEach(listener => {
        listener();
    });
}


function storeBlocks() {
        var program;
        var blocksToSave = [];

        // TODO: Save empty blocks?
        blocks.forEach((block) => {
            if(block && block.rep){
                blocksToSave.push(block);
            }
        });
            
        if(loadedProgram){
            program = loadedProgram;
            program.blocks = blocks;
            program.name = currentProgramName;
            RobbyDatabaseAction.save(program);
            notifyProgramsChangeListeners();
        } else {     
            program = new Program(currentProgramName, ProgramType.BLOCKS, [], blocksToSave); 
            RobbyDatabaseAction.add(program);
            loadedProgram = program;
            notifyProgramsChangeListeners();
        }
}

// Export

export {
    add,
    addAt,
    swap,
    remove,
    removeAll,
    addBlocksChangeListener,
    addLoadedProgramChangeListener,
    addPickerItemsChangeListener,
    addProgramNameChangeListener,
    addBlocksProgramsChangeListener,
    blocks,
    updateBlock,
    updateRepeatValue,
    updateProgramName,
    loadedProgram,
    currentProgramName,
    pickerItems,
    refreshPickerItems,
    loadProgramByName,
    clearBlocksProgram,
    storeBlocks
};