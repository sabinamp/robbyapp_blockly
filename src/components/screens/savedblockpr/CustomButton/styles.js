import { StyleSheet } from 'react-native';

const Base = StyleSheet.create({
  main: {
    padding: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9C27B0'

  },
  label: {
    color: '#333',
    fontWeight: '400',
    fontSize: 18
  },
  rounded: {
    borderRadius: 20,
  },

});
export { Base };