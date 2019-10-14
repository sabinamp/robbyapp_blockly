import {Component} from 'react';
import {StyleSheet, View, Alert, Picker} from 'react-native';
import React from 'react';
import NumericInput from '../../../../controls/NumericInput';
import i18n from '../../../../../../resources/locales/i18n';


export default class ProgramInput extends Component {
    // checks input changes of component NumericInput before upcalling and
    // updating application state

    state = {
        selectedProgram: {}
    }

    onChanged = (text) => {
        let newText = '';
        let numbers = '0123456789';

        if (parseInt(text) > 100) {
            Alert.alert(i18n.t('SpeedInput.invalidEntry'), i18n.t('SpeedInput.invalidEntryMessage'));
            newText = '100';
        } else {
            for (let i = 0; i < text.length; i++) {
                if (numbers.indexOf(text[i]) > -1) {
                    newText = newText + text[i];
                } else {
                    Alert.alert(i18n.t('SpeedInput.invalidEntry'), i18n.t('SpeedInput.invalidEntryMessage'));
                }
            }
        }
        this.props.onchange(newText);
    };

    render() {
        const index = this.props.index;
        return (
            <View key={index} style={parseInt(index) == this.props.selected ? styles.selected_row : styles.row}>
            <Picker selectedValue={this.state.selectedProgram[index]}
                    style={{height: 35, width: '80%', marginTop:12.5}} 
                    onValueChange={(itemValue, itemIndex) => {
                        this.state.selectedProgram[index] = itemValue; 
                        this.setState({})}}>
                        {this.props.pickerItems}
            </Picker>
            <View style={{width: '20%', height: '70%', marginTop: 9}}><NumericInput onchange={this.onChanged} val={this.props.val}></NumericInput></View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        height: 60,
        margin: 0,
        width: '100%',
        flexDirection: 'row',
        alignContent: 'center',
    },
    selected_row: {
        height: 60,
        margin: 0,
        width: '100%',
        flexDirection: 'row',
        borderColor: '#d6d6d6',
        borderWidth: 1.0,
    },
    numinput: {
        justifyContent: 'center',
        zIndex: 1,
        flexDirection: 'row',
        width: '30%',
        height: '70%',
    },

});
