import { StyleSheet } from 'react-native';

const Base = StyleSheet.create({
  main: {
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#f3f5f3',
    fontWeight: '400'
  },
  rounded: {
    borderRadius: 20,
  },
});
const Danger = StyleSheet.create({
  main: {
    backgroundColor: '#e74c3c',
  },
});
const Info = StyleSheet.create({
  main: {
    backgroundColor: '#9C27B0',
  },
});
const Success = StyleSheet.create({
  main: {
    backgroundColor: '#3498db',
  },
});
const Default = StyleSheet.create({
  main: {
    backgroundColor: 'rgba(0 ,0 ,0, 0)',
  },
  label: {
    color: '#333',
  },
});

export {
  Base,
  Danger,
  Info,
  Success,
  Default,
};