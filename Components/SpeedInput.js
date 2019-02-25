import { Component } from "react";
import { StyleSheet, View, Alert } from "react-native";
import React from "react";
import NumericInput from "./NumericInput";

export default class SpeedInput extends Component {
    // checks input changes of component NumericInput before upcalling and
    // updating application state
    onChanged = (text) => {
        let newText = '';
        let numbers = '0123456789';

        if (parseInt(text) > 100) {
            Alert.alert("Ungültige Eingabe", "Bitte gib nur ganze Zahlen zwischen 0-100 ein.");
            newText = '100';
        } else {
            for (let i = 0; i < text.length; i++) {
                if (numbers.indexOf(text[i]) > -1) {
                    newText = newText + text[i];
                } else {
                    Alert.alert("Ungültige Eingabe", "Bitte gib nur ganze Zahlen zwischen 0-100 ein.");
                }
            }
        }
        this.props.onchange(newText);
    }

    render() {
        return (
            <View style={styles.outer}>
                <View style={styles.progressbar}>
                    <View style={{ backgroundColor: this.props.col1, flex: this.props.val1 }} />
                    <View style={{ backgroundColor: this.props.col2, flex: this.props.val2 }} />
                </View>
                <View style={styles.numinput}>
                    <NumericInput onchange={this.onChanged} val={this.props.val} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outer: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressbar: {
        position: 'absolute',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        zIndex: 0
    },
    numinput: {
        position: 'absolute',
        justifyContent: 'center',
        zIndex: 1,
        flexDirection: 'row',
        width: '30%',
        height: '70%'
    }

});
