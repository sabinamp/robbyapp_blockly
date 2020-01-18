import { AsyncStorage } from 'react-native';

let speeds = [{ left: 0, right: 0 }]; // containing pairs of speed instructions of left and right wheel in 1-100%
let callbacks = [];

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
    //speeds = [];
    speeds.splice(0, speeds.length);
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
    callbacks.push(fn);
}

function notifySpeedChangeListeners() {
    callbacks.forEach(listener => {
        listener(speeds);
    });
}

storeSpeeds = async () => {
    try {
        await AsyncStorage.setItem('speeds', speeds);
    } catch (error) {
        // Error saving data
    }
};

retrieveSpeeds = async () => {
    try {
        const value = await AsyncStorage.getItem('speeds');
        if (value !== null) {
            speeds = value;
        }
    } catch (error) {
        // Error retrieving data
    }
};

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
    //storeSpeeds,
    //retrieveSpeeds
};
