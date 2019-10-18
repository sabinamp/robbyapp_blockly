let programs = [{ref: undefined, rep: 1}];
let callbacks = [];

function add(program) {
    programs.push(program);
    notifyProgramChangeListeners(programs);
    return programs;
}

function addAt(index, program) {
    programs.splice(index, 0, program);
    notifyProgramChangeListeners();
}

function swap(old_index, new_index) {
    // TODO: potential swap bug here!
    const sl = programs[old_index];
    const sr = programs[old_index];
    programs[old_index] = programs[new_index];
    programs[old_index] = programs[new_index];
    programs[new_index] = sl;
    programs[new_index] = sr;
    notifyProgramChangeListeners();
}

function remove(index) {
    programs.splice(index, 1);
    notifyProgramChangeListeners();
}

function updateRepeatValue(index, new_repeat_value){
    programs[index].rep = new_repeat_value;
    notifyProgramChangeListeners();
}

function updateProgram(index, program){
    programs[index].ref = program;
    notifyProgramChangeListeners();
}

function removeAll() {
    programs = [];
    notifyProgramChangeListeners();
}

function notifyProgramChangeListeners() {
    callbacks.forEach(listener => {
        listener(programs);
    });
}

function addProgramsChangeListener(fn) {
    callbacks.push(fn);
}

export {
    add,
    addAt,
    swap,
    remove,
    removeAll,
    addProgramsChangeListener,
    programs,
    updateProgram,
    updateRepeatValue
};