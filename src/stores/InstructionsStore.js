import { ProgramType, Program, Instruction } from '../model/DatabaseModels';
var RobbyDatabaseAction = require('../database/RobbyDatabaseActions');

let instructions = [new Instruction(0,0)]; // containing pairs of speed instructions of left and right wheel in 1-100%
let instructionsChangeCallbacks = [];
let programNameChangeCallbacks = [];
let stepsProgramsChangeCallbacks = [];
let currentProgramName = "";
let loadedProgram = undefined;


// Instructions

function add(value) {
    instructions.push(value);
    notifySpeedChangeListeners();
    return instructions;
}

function addAt(index, value) {
    instructions.splice(index, 0, value);
    notifySpeedChangeListeners();
}

function swap(old_index, new_index) {
    const sl = instructions[old_index].left;
    const sr = instructions[old_index].right;
    instructions[old_index].left = instructions[new_index].left;
    instructions[old_index].right = instructions[new_index].right;
    instructions[new_index].left = sl;
    instructions[new_index].right = sr;
    notifySpeedChangeListeners();
}

function remove(index) {
    instructions.splice(index, 1);
    notifySpeedChangeListeners();
}

function removeAll() {
    instructions = [];
    notifySpeedChangeListeners();
}

function updateLeftSpeed(index, new_speed) {
    instructions[index].left = new_speed;
    notifySpeedChangeListeners();
}

function updateRightSpeed(index, new_speed) {
    instructions[index].right = new_speed;
    notifySpeedChangeListeners();
}

function addSpeedChangeListener(fn) {
    instructionsChangeCallbacks.push(fn);
}

function notifySpeedChangeListeners() {
    instructionsChangeCallbacks.forEach(listener => {
        listener(instructions);
    });
}

function storeInstructions() {
    var program;    
        if(loadedProgram){
            program = loadedProgram;
            program.steps = instructions;
            program.name = currentProgramName;
            RobbyDatabaseAction.save(program);
            notifyStepsProgramsChangeListeners();
        } else {     
            program = new Program(currentProgramName, ProgramType.STEPS, instructions); 
            RobbyDatabaseAction.add(program);
            loadedProgram = program;
            notifyStepsProgramsChangeListeners();
        }
};

function clearInstructions(){
    instructions = [new Instruction(0,0)];
    currentProgramName = "";
    loadedProgram = undefined;
    notifyProgramNameChangeListeners();
    notifySpeedChangeListeners();
}

function loadSpeedProgramByName(name){
    loadedProgram = RobbyDatabaseAction.findOne(name);
    instructions = loadedProgram.steps;
    currentProgramName = loadedProgram.name;

    notifyProgramNameChangeListeners();
    notifySpeedChangeListeners()
}

// Program name

function addProgramNameChangeListener(fn){
    programNameChangeCallbacks.push(fn);
}

function notifyProgramNameChangeListeners() {
    programNameChangeCallbacks.forEach(listener => {
        listener(currentProgramName);
    })
}

function updateProgramName(name) {
    currentProgramName = name;
    notifyProgramNameChangeListeners();
}

// Other
function addStepsProgramsChangeListener(fn){
    stepsProgramsChangeCallbacks.push(fn);
}

function notifyStepsProgramsChangeListeners() {
    stepsProgramsChangeCallbacks.forEach(listener => {
        listener();
    })
}
// Export

export {
    add,
    addAt,
    swap,
    remove,
    removeAll,
    updateLeftSpeed,
    updateRightSpeed,
    addSpeedChangeListener,
    instructions,
    updateProgramName,
    addProgramNameChangeListener,
    currentProgramName,
    storeInstructions,
    clearInstructions,
    loadSpeedProgramByName,
    addStepsProgramsChangeListener
};
