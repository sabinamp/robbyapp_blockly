import { ProgramType, Program, Instruction } from '../model/DatabaseModels';
var RobbyDatabaseAction = require('../database/RobbyDatabaseActions');

let speeds = [new Instruction(0,0)]; // containing pairs of speed instructions of left and right wheel in 1-100%
let speedsChangeCallbacks = [];
let programNameChangeCallbacks = [];
let currentProgramName = "";
let loadedProgram = undefined;


// Speeds

function add(value) {
    speeds.push(value);
    notifySpeedChangeListeners();
    return speeds;
}

function addAt(index, value) {
    speeds.splice(index, 0, value);
    notifySpeedChangeListeners();
}

function swap(old_index, new_index) {
    const sl = speeds[old_index].left;
    const sr = speeds[old_index].right;
    speeds[old_index].left = speeds[new_index].left;
    speeds[old_index].right = speeds[new_index].right;
    speeds[new_index].left = sl;
    speeds[new_index].right = sr;
    notifySpeedChangeListeners();
}

function remove(index) {
    speeds.splice(index, 1);
    notifySpeedChangeListeners();
}

function removeAll() {
    speeds = [];
    notifySpeedChangeListeners();
}

function updateLeftSpeed(index, new_speed) {
    speeds[index].left = new_speed;
    notifySpeedChangeListeners();
}

function updateRightSpeed(index, new_speed) {
    speeds[index].right = new_speed;
    notifySpeedChangeListeners();
}

function addSpeedChangeListener(fn) {
    speedsChangeCallbacks.push(fn);
}

function notifySpeedChangeListeners() {
    speedsChangeCallbacks.forEach(listener => {
        listener(speeds);
    });
}

function storeSpeeds() {
    var program;    
        if(loadedProgram){
            program = loadedProgram;
            program.speeds = speeds;
            program.name = currentProgramName;
            RobbyDatabaseAction.save(program);
        } else {     
            program = new Program(currentProgramName, ProgramType.STEPS, speeds); 
            RobbyDatabaseAction.add(program);
            loadedProgram = program;
        }
};

function clearSpeeds(){
    speeds = [new Instruction(0,0)];
    currentProgramName = "";
    notifyProgramNameChangeListeners();
    notifySpeedChangeListeners();
}

function loadSpeedProgramByName(name){
    loadSpeedProgram = RobbyDatabaseAction.findOne(name);
    speeds = loadedProgram.speeds;
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
    speeds,
    updateProgramName,
    addProgramNameChangeListener,
    currentProgramName,
    storeSpeeds,
    clearSpeeds,
    loadSpeedProgramByName,
};
