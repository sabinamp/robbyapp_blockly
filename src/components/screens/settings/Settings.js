import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Alert } from 'react-native';
import { Appbar } from 'react-native-paper';

import {
    isConnected,
    addConnectedChangeListener,
    addDeviceNameChangeListener,
    addIntervalChangeListener,
    getDeviceName,
    setDeviceName,
    setConnected,
    getLoopCounter,
    getDuration,
    getInterval,
    setInterval,
} from '../../../stores/SettingsStore';

//import CalibrationInput from './CalibrationInput';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';
import i18n from '../../../../resources/locales/i18n';
import RobotProxy from '../../../communication/RobotProxy';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Settings extends Component {
    static navigationOptions = {
        drawerIcon: () => (
            <Icon style={styles.icon} name="settings" size={25} color="#9C27B0" />
        )
    }
    state = {
        device_name: getDeviceName(),
        sub_title: i18n.t('Settings.device'),
        loops: getLoopCounter().toString(),
        duration: getDuration().toString(),
        interval: getInterval() === 0 ? '' : getInterval().toString(),
        connected: isConnected(),
    };

    constructor() {
        super();
        addDeviceNameChangeListener(name => {
            this.setState({ device_name: name });
        });
        addIntervalChangeListener(value => {
            this.setState({ interval: value == 0 ? '' : value.toString() });
        });
        addConnectedChangeListener(value => {
            this.setState({ connected: isConnected() });
        });
    }

    handleDisconnect() {
        setDeviceName({ device: i18n.t('Programming.noConnection') });
        setInterval(0);
        setConnected(false);
        this.setState({
            device: undefined,
            remaining_btns_disabled: true,
            stop_btn_disabled: true,
        });
    }

    handleResponse(res) {
        switch (res.type) {
            case 'interval':
                setInterval(res.value);
                break;
            case 'speedLine':
                add({ left: res.left, right: res.right });
                break;
            case 'finishedDownload':
                this.setState({
                    remaining_btns_disabled: false,
                    stop_btn_disabled: true,
                });
                Alert.alert(i18n.t('Programming.download'), i18n.t('Programming.downloadMessage'));
                break;
            case 'finishedDriving':
                Alert.alert(i18n.t('Programming.drive'), i18n.t('Programming.driveMessage'));
                this.setState({
                    remaining_btns_disabled: false,
                    stop_btn_disabled: true,
                });
                break;
            case 'stop':
                this.setState({
                    remaining_btns_disabled: false,
                    stop_btn_disabled: true,
                });
                break;
            case 'finishedLearning':
                Alert.alert(i18n.t('Programming.record'), i18n.t('Programming.recordMessage'));
                this.setState({
                    remaining_btns_disabled: false,
                    stop_btn_disabled: true,
                });
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <View style={[styles.container]}>
                <Appbar>
                    <Appbar.Action
                        icon="menu"
                        size={32}
                        onPress={() => this.props.navigation.openDrawer()}
                    />
                    <Appbar.Content
                        style={{ position: 'absolute', left: 40 }}
                        title="Explore-it"
                        size={32}
                    />
                    <Appbar.Content
                        style={{ position: 'absolute', right: 0 }}
                        title={this.state.device_name}
                        subtitle={this.state.sub_title}
                        size={32}
                    />
                </Appbar>

                <View style={{ flex: 1, padding: 40 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 15 }}>
                        {i18n.t('Settings.settings')}
                    </Text>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Text style={{ height: 50, width: '20%', marginLeft: 40, marginRight: 5 }}>
                            {i18n.t('Settings.interval')}
                        </Text>
                        <TextInput
                            style={{
                                padding: 5,
                                width: 60,
                                height: 50,
                                borderWidth: 1,
                                borderColor: 'grey',
                                backgroundColor: 'white',
                                justifyContent: 'center',
                            }}
                            keyboardType="numeric"
                            textAlign={'center'}
                            mode="outlined"
                            editable={this.state.connected}
                            onChangeText={text => {
                                this.setState({
                                    interval: text,
                                });
                                if (text.length > 0) {
                                    const value = parseInt(text);
                                    RobotProxy.setInterval(value);
                                }
                            }}
                            value={this.state.interval}
                        />
                        <Text style={{ height: 50, marginLeft: 15 }}>
                            {i18n.t('Settings.interval-unit')}
                        </Text>
                    </View>

                    <Text style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 15 }}>
                        {i18n.t('Settings.learn')}
                    </Text>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Text style={{ height: 50, width: '20%', marginLeft: 40, marginRight: 5 }}>
                            {i18n.t('Settings.duration')}
                        </Text>
                        <TextInput
                            style={{
                                padding: 5,
                                width: 60,
                                height: 50,
                                borderWidth: 1,
                                borderColor: 'grey',
                                backgroundColor: 'white',
                                justifyContent: 'center',
                            }}
                            keyboardType="numeric"
                            textAlign={'center'}
                            mode="outlined"
                            onChangeText={text => {
                                const d = text.length === 0 ? 0 : parseInt(text);
                                this.setState({
                                    duration: text,
                                });
                                setDuration(d);
                            }}
                            value={this.state.duration}
                        />
                        <Text style={{ height: 50, marginLeft: 15 }}>
                            {i18n.t('Settings.duration-unit')}
                        </Text>
                    </View>



                </View>
                <Appbar style={styles.bottom}>

                    <Appbar.Action icon="stop" size={32}
                        disabled={this.state.stop_btn_disabled}
                        onPress={() => {
                            RobotProxy.stop().catch(e => this.handleDisconnect());
                        }} />
                    <Appbar.Action icon="play-arrow"
                        size={32}
                        disabled={this.state.remaining_btns_disabled}
                        onPress={() => {
                            this.setState({
                                stop_btn_disabled: false,
                                remaining_btns_disabled: true,
                            });
                            RobotProxy.run().catch(e => this.handleDisconnect());
                        }} />
                    <Appbar.Action icon="fiber-manual-record"
                        size={32}
                        onPress={() => {
                            RobotProxy.record(getDuration(), getInterval()).catch(e => this.handleDisconnect());
                        }} />
                    <Appbar.Action icon="file-download"
                        size={32}
                        disabled={this.state.remaining_btns_disabled}
                        onPress={() => {
                            this.setState({
                                stop_btn_disabled: true,
                                remaining_btns_disabled: true,
                            });
                            removeAll();
                            RobotProxy.download().catch(e => this.handleDisconnect());
                        }} />



                </Appbar>
            </View>
        );
    }
}

//                    <Text style={{marginTop: 20, fontSize: 16, fontWeight: 'bold'}}>
//                        {i18n.t('Settings.calibrate')}
//                    </Text>
//                    <View style={{ flex: 1, flexDirection: 'row'}}>
//                        <CalibrationInput val={5} limit={20} />
//                        <View style={{ flex: 1, alignItems: 'center', height: 220, justifyContent: 'center'}}>
//                            <Icon
//                                reverse
//                                name='play-arrow'
//                                color='#9c27b0'
//                                size={32}
//                                onPress={() => alert('run')} />
//                        </View>
//                        <CalibrationInput val={19} limit={20} />
//                    </View>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        ...ifIphoneX(
            {
                paddingTop: getStatusBarHeight() + 10,
            },
            {},
        ),
    },
    icon: {
        padding: 0,
    },

});
