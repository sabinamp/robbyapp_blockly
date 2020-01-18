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
const Default = StyleSheet.create({
  main: {
    backgroundColor: '#e74c3c',
  },
  label: {
    color: '#333',
  },
});

const Neutral = StyleSheet.create({
  main: {
    backgroundColor: '#4b516B',
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
;

export {
  Base,
  Neutral,
  Info,
  Success,
  Default,
}; 