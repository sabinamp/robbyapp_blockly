
let speeds = [{ left: 0, right: 0 }]; // containing pairs of speed instructions of left and right wheel in 1-100%
let callbacks = [];

function add(value) {
    speeds.push(value);
    notifySpeedChangeListeners();
    return speeds;
}


function remove(index) {
    speeds.splice(index, 1);
    notifySpeedChangeListeners();
}

function removeAll() {
    //speeds = [];
    speeds.splice(0, speeds.length);
    notifySpeedChangeListeners();
}
function updateAll(array2) {
    Object.assign(speeds, array2);
    notifySpeedChangeListeners();
}

function updateStep(index, new_speed) {
    speeds[index].left = new_speed.left;
    speeds[index].right = new_speed.right;
    notifySpeedChangeListeners();
}


function addSpeedChangeListener(fn) {
    callbacks.push(fn);
}

function notifySpeedChangeListeners() {
    callbacks.forEach(listener => {
        listener(speeds);
    });
}



export {
    add,
    remove,
    removeAll,
    updateStep,
    addSpeedChangeListener,
    speeds,
    updateAll
};
