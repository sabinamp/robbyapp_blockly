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
    alignItems: 'flex-end'
  },
  button: {
    height: 130,
    width: 130,
    marginRight: 5,
    marginTop: 5,
  },
})

export default Button