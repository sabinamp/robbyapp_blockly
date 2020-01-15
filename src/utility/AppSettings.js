import { AsyncStorage } from 'react-native';

const loadAppSettings = async () => {
  let settings = { language: 'en', duration: 1 };
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
export { setSettings, loadAppSettings };