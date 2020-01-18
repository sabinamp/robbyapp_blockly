import React from 'react'
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import CustomButton from './CustomButton';

const Button = ({ openBlockly, blockname, colorHolder }) => (
  <View style={styles.buttonContainer}>
    <CustomButton info underlayColor={colorHolder} style={styles.button} onPress={openBlockly}>
      <Text>
        {blockname}
      </Text>
    </CustomButton>
  </View>
)


const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'stretch',
  },
  button: {
    height: 150,
    marginRight: 10,
    marginTop: 10,
  },
})

export default Button