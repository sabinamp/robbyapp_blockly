import {AsyncStorage} from 'react-native';


const loadAppSettings = async () => {
    try {
        await AsyncStorage.getItem()
    } catch (error) {
        // Error retrieving data
        console.log(error.message);
    }
};
