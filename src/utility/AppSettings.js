import {AsyncStorage} from 'react-native';
import {Program} from '../model/DatabaseModels';


const loadAppSettings = async () => {
    let settings = {language: 'en', duration: 1};
    try {
        AsyncStorage.multiGet(['language', 'duration']).then(res => {
            settings.language = res[0][1];
            settings.duration = res[1][1];
            return settings;
        });
    } catch (error) {
        return e;
    }
};

const setSettings = async (key, value) => {
    try {
        AsyncStorage.setItem(key, value).then(res => true);
    } catch (e) {
        return e;
    }
};

const loadActiveProgram = async () => {
    try {
        AsyncStorage.getItem('ActiveProgram').then(res => {
            return Program.fromDatabase(JSON.parse(res));
        });
    } catch (e) {
        return e;
    }
};

function saveActiveProgram(program) {
    setSettings('ActiveProgram', JSON.stringify(program));
}
