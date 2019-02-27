import React, {Component} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {Appbar} from 'react-native-paper';
import {createMaterialTopTabNavigator, createAppContainer} from "react-navigation";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MainScreen, MixedViewScreen, BlockViewScreen } from "./Tabs/index";
import BleService from '../../../integration/BleService';
import {speeds, add, remove_all, set_update_speeds_callback} from '../../../Stores/SpeedsStore';
import {set_update_device_name_callback, device_name, update_device_name, loops} from "../../../Stores/SettingsStore";
import {getStatusBarHeight, ifIphoneX} from 'react-native-iphone-x-helper'
import {SinglePickerMaterialDialog} from "react-native-material-dialog";


export default class Programming extends Component {
    state = {
        device_name: device_name,
        sub_title: 'Gerät',
        visible: false,
        device: undefined,
        devices: [],
        is_learning: false,
        speeds: speeds,
        stop_btn_disabled: true,
        remaining_btns_disabled: true,
        btn_disabled_states: {
            play: false,
            record: false,
            run: false,
            download: false,
            upload: false
        },
        loop_counter: 0
    };

    constructor(props) {
        super(props);

        set_update_device_name_callback((name) => {this.setState({ device_name: name });});
        set_update_speeds_callback((speeds) => {this.setState({ speeds: speeds });});
    }

    speed_padding(speed){
        if(speed !== 0)
            speed = parseInt((speed * 2.55)); // 0-70 no reaction, therefore 255 -> 185 (speed * 1.85)+70
        speed = String(speed);
        while (speed.length < 3) {speed = "0" + speed;}
        return speed
    }

    render() {
        return (
            <View style={[styles.container]}>
                <SinglePickerMaterialDialog
                    title={'Wähle Gerät'}
                    items={this.state.devices.map((row, index) => ({ value: index, label: row }))}
                    visible={this.state.visible}
                    selectedItem={this.state.device}
                    onCancel={() => this.setState({ visible: false })}
                    onOk={result => {
                        this.setState({remaining_btns_disabled:false});
                        this.setState({stop_btn_disabled:false});
                        let device = result.selectedItem.label;
                        BleService.setActDevice(device);
                        BleService.connectToActDevice((response) => {
                            // responseHandler

                            // Alert.alert("Message", response);
                            if(response.trim().toLowerCase()==='_sr_')
                                this.setState({ is_learning: false});

                            if(this.state.is_learning){
                                if(response.match("\\b[0-9]{3}\\b,\\b[0-9]{3}\\b")){
                                    // speed values from beam
                                    let read_speeds = response.trim().split(',');
                                    let speed_l = (read_speeds[0]/2.55);
                                    let speed_r = (read_speeds[1]/2.55); // (read_speeds[1]/1.85)-70
                                    if(speed_l < 0)
                                        speed_l = 0;
                                    if(speed_r < 0)
                                        speed_r = 0;
                                    add({left: parseInt(speed_l), right: parseInt(speed_r)})
                                }
                                /*
                                if(response.trim().toLowerCase()==='full'){
                                    remove_all();
                                    BleService.sendCommandToActDevice('B');
                                }
                                */
                                if(response.trim().toLowerCase()==='full'){
                                    // done learning
                                    Alert.alert("Aufzeichnen", 'Erfolgreich aufgezeichnet und auf dem Roboter gespeichert!');
                                    this.setState({remaining_btns_disabled:false});
                                }
                                if(response.trim().toLowerCase()===',,,,') {
                                    // finished beam
                                    this.setState({ is_learning: false});
                                    Alert.alert("Download", 'Anweisungen erfolgreich von Roboter heruntergeladen!');
                                    this.setState({remaining_btns_disabled:false});
                                }
                            }else {
                                if (response.trim().toLowerCase() === 'full') {
                                    // done uploading
                                    Alert.alert("Upload", 'Alle Anweisungen erfolgreich auf Roboter geladen!');
                                    this.setState({remaining_btns_disabled: false});
                                } else if (response.trim().toLowerCase() === '_end') {
                                    // done driving
                                    if (this.state.loop_counter === loops) {
                                        Alert.alert("Fahren", 'Anweisungen abgearbeitet, Fahrt erfolgreich abgeschlossen!');
                                        this.setState({remaining_btns_disabled: false});
                                        this.setState({loop_counter: 0});
                                    } else {
                                        BleService.sendCommandToActDevice('G');
                                        this.setState({loop_counter: this.state.loop_counter + 1});
                                    }
                                }
                            }
                        }, () => {
                            // messageHandler
                            // Alert.alert("Message1", 'new message');
                        }, () => {
                            // errorHandler
                            Alert.alert("errorHandler", 'error trying to connect');
                        }, (error, device) => {
                            // disconnectionHandler
                            Alert.alert("Verbindungsunterbruch", 'Bluetoothverbindung zu Roboter verloren:' + device.name);
                            update_device_name({ device: 'Keine Verbindung'})
                        });
                        this.setState({ visible: false });
                        update_device_name({ device: device.substr(device.length - 5) });
                        this.setState({ device: device });
                        this.setState({remaining_btns_disabled:true});
                        this.setState({stop_btn_disabled:true});
                    }}
                    colorAccent="#9c27b0"
                />
                <Appbar style={styles.top}>
                    <Appbar.Action icon="menu" size={32} onPress={() => this.props.navigation.openDrawer()} />
                    <Appbar.Content style={{position: 'absolute', left: 40}} title="Explore-it" size={32} />
                    <Appbar.Content style={{position: 'absolute', right: 0}}
                                    title={this.state.device_name}
                                    subtitle={this.state.sub_title}
                                    size={32} />
                </Appbar>
                <TabContainer/>
                <Appbar style={styles.bottom}>
                    <Appbar.Action icon="stop" size={32}
                                   disabled={this.state.stop_btn_disabled}
                                   onPress={() => {
                                       this.setState({remaining_btns_disabled:false});
                                       BleService.sendCommandToActDevice('S')}} />
                    <Appbar.Action icon="play-arrow" size={32}
                                   disabled={this.state.remaining_btns_disabled}
                                   onPress={() => {
                                       this.setState({remaining_btns_disabled:true});
                                       BleService.sendCommandToActDevice('G');
                                       this.setState({loop_counter: this.state.loop_counter + 1});
                    }} />
                    <Appbar.Action icon="fiber-manual-record" size={32}
                                   disabled={this.state.remaining_btns_disabled}
                                   onPress={() => {
                                       this.setState({remaining_btns_disabled:true});
                                       BleService.sendCommandToActDevice('F');
                        BleService.sendCommandToActDevice('L');
                        this.setState({ is_learning: true });
                    }} />
                    <Appbar.Action icon="fast-forward"
                                   size={32}
                                   disabled={this.state.remaining_btns_disabled}
                                   onPress={() => {
                                       this.setState({remaining_btns_disabled:true});
                                       BleService.sendCommandToActDevice('R')}} />
                    <Appbar.Action icon="file-download"
                                   size={32}
                                   disabled={this.state.remaining_btns_disabled}
                                   onPress={() => {
                                       this.setState({remaining_btns_disabled:true});
                                       remove_all();
                                       BleService.sendCommandToActDevice('B');
                                   }} />
                    <Appbar.Action icon="file-upload"
                                   size={32}
                                   disabled={this.state.remaining_btns_disabled}
                                   onPress={() => {
                                       this.setState({remaining_btns_disabled:true});
                                       BleService.sendCommandToActDevice('F');
                                       BleService.sendCommandToActDevice('D'+this.state.speeds.length);
                                       BleService.sendCommandToActDevice('I1');
                                       BleService.sendCommandToActDevice('E');
                                       for(let i = 0; i < this.state.speeds.length; i++) {
                                       let item = this.state.speeds[i];
                                       let speed = this.speed_padding(item.left)+','+this.speed_padding(item.right)+'xx';
                                       BleService.sendCommandToActDevice(speed);
                                   }
                                       BleService.sendCommandToActDevice(',,,,');
                                   }} />
                    <Appbar.Action icon="bluetooth-connected" style={{position: 'absolute', right: 0}} size={32} onPress={() => {
                        // check if bluetooth even activated:
                        // use checkBluetoothState and local state to represent connectivity
                        this.setState({ devices: [] });
                        BleService.scanningForDevices((error) => {
                            console.log(error);
                        }, (device) => {
                            let devices = this.state.devices;
                            devices.push(device);
                            this.setState({ devices: devices});
                        });
                        setTimeout(() => {
                            this.setState({ visible: true });
                        }, 1000);
                    }} />
                </Appbar>
            </View>
        );
    }
}

const TabNavigator = createMaterialTopTabNavigator({
    First: {
        screen: MainScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <MaterialCommunityIcon name="menu" size={24} color={tintColor}/>
            )
        },
    },
    Second: {
        screen: MixedViewScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <MaterialCommunityIcon name="page-layout-body" size={24} color={tintColor}/>
            )
        },
    },
    Third: {
        screen: BlockViewScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <MaterialCommunityIcon name="page-layout-header" size={24} color={tintColor}/>
            )
        },
    }
}, {
    tabBarOptions: {
        activeTintColor: '#9c27b0',
        inactiveTintColor: 'gray',
        showLabel: false,
        indicatorStyle: {
            backgroundColor: '#9c27b0'
        },
        style: {
            backgroundColor: 'white',
        },
        showIcon: true
    }
});

const TabContainer = createAppContainer(TabNavigator);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9c27b0',
        ...ifIphoneX({
            paddingTop: getStatusBarHeight() + 10,
        }, {

        })
    },
    bottom: {
        position: 'absolute',
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
});