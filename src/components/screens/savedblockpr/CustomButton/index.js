import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Base,
} from './styles';

export default class Button extends Component {


  render() {

    const { children, onPress, style, rounded, } = this.props;
    return (<TouchableOpacity
      activeOpacity={0.6}
      style={[
        Base.main,
        rounded ? Base.rounded : null,
        style,
      ]}
      onPress={onPress} >
      <Text style={[Base.label]}>{children}</Text>
    </TouchableOpacity>
    );

  }
}