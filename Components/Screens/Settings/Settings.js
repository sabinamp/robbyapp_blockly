import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableHighlight } from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { Appbar } from 'react-native-paper';
import { Row } from "react-native-easy-grid";
import { set_update_device_name_callback, device_name, loops, set_loops } from "../../../Stores/SettingsStore";
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper'
import CalibrationInput from '../../CalibrationInput'

export default class Settings extends Component {

    state = {
        device_name: device_name,
        sub_title: 'Gerät',
        loops: loops
    };

    constructor() {
        super();
        set_update_device_name_callback((name) => { this.setState({ device_name: name }); });
    }

    render() {
        return (
            <View style={[styles.container]}>
                <Appbar style={styles.top}>
                    <Appbar.Action icon="menu" size={32} onPress={() => this.props.navigation.openDrawer()} />
                    <Appbar.Content style={{position: 'absolute', left: 40}} title="Explore-it" size={32} />
                    <Appbar.Content style={{ position: 'absolute', right: 0 }}
                        title={this.state.device_name}
                        subtitle={this.state.sub_title} size={32} />
                </Appbar>
                <View>
                    <View style={{ margin: '5%' }}>
                        <Text>
                            Lernen:
                        </Text>
                        <View>
                            <Row style={{ margin: '10%', height: 30 }}>
                                <View style={{ flex: 1, flexDirection: 'row', margin: '5%' }}>
                                    <View style={{ width: '50%' }}>
                                        <Text>
                                            Interval:
                                        </Text>
                                    </View>
                                    <View style={{ width: '50%' }}>
                                        <View style={{ height: '70%', width: '100%', borderWidth: 1, borderColor: 'grey', backgroundColor: 'white', justifyContent: 'center' }}>
                                            <TextInput
                                                style={{ height: '100%', width: '100%' }}
                                                keyboardType='numeric'
                                                textAlign={'center'}
                                                mode="outlined"
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', margin: '5%' }}>
                                    <View style={{ width: '50%' }}>
                                        <Text>
                                            Dauer:
                                        </Text>
                                    </View>
                                    <View style={{ width: '50%' }}>
                                        <View style={{ height: '70%', width: '100%', borderWidth: 1, borderColor: 'grey', backgroundColor: 'white', justifyContent: 'center' }}>
                                            <TextInput
                                                style={{ height: '100%', width: '100%' }}
                                                keyboardType='numeric'
                                                textAlign={'center'}
                                                mode="outlined"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </Row>
                            <Button
                                title='Speichern'
                                color="#9c27b0"
                                onPress={() => alert('something')} />
                        </View>
                    </View>
                    <Divider />
                    <View style={{ marginLeft: '5%' }}>
                        <Text>
                            Loops:
                        </Text>
                        <View>
                            <Row style={{ margin: '10%', height: 30 }}>
                                <View style={{ height: 50, width: 60, borderWidth: 1, borderColor: 'grey', backgroundColor: 'white', justifyContent: 'center' }}>
                                    <TextInput
                                        style={{ height: '100%', width: '100%' }}
                                        keyboardType='numeric'
                                        textAlign={'center'}
                                        mode="outlined"
                                        onChangeText={(text) => { this.setState({ loops: parseInt(text) }); set_loops(parseInt(text)) }}
                                        value={this.state.loops.toString()}
                                    />
                                </View>
                            </Row>
                        </View>
                    </View>
                    <Divider />
                    <View style={{ marginLeft: '5%' }}>
                        <Text>
                            Kalibrieren:
                        </Text>
                        <View>
                            <Row>
                                <CalibrationInput val={5} limit={20} />
                                <View style={{ flex: 1, alignItems: 'center', margin: '5%', height: 180, justifyContent: 'center' }}>
                                    <Icon
                                        reverse
                                        name='play-arrow'
                                        color='#9c27b0'
                                        size={32}
                                        onPress={() => alert('run')} />
                                </View>
                                <CalibrationInput val={19} limit={20} />
                            </Row>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        ...ifIphoneX({
            paddingTop: getStatusBarHeight() + 10,
        }, {

            })
    },
    bottom: {
        position: 'absolute',
        padding: 50,
        left: 0,
        right: 0,
        ...ifIphoneX({
            bottom: 15
        }, {
                bottom: 0,
            })
    },
    col: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        margin: 5
    },
    row: {
        height: 60,
        margin: 10
    },
    view: {
        marginBottom: 55,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    outer: {
        height: 180,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttons: {
        position: 'absolute',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        zIndex: 0
    },
    btn_label: {
        margin: '10%'
    },
    btn_label_btm: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        margin: '10%'
    },
    number: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        flexDirection: 'row',
        backgroundColor: '#9c27b0',
        borderRadius: 25,
        height: 50,
        width: 50
    }
});
