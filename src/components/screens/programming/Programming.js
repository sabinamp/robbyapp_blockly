import React, {Component} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {Appbar} from 'react-native-paper';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MainTab, MixedViewTab, SecondTab} from './tabs/index';
import RobotProxy from '../../../communication/RobotProxy';
import {instructions, add, removeAll, addSpeedChangeListener, clearInstructions, storeInstructions} from '../../../stores/InstructionsStore';
import {blocks, addBlocksChangeListener} from '../../../stores/BlocksStore'
import {
    addDeviceNameChangeListener,
    getDeviceName,
    setDeviceName,
    setConnected,
    getLoopCounter,
    getDuration,
    getInterval,
    setInterval,
} from '../../../stores/SettingsStore';
import {getStatusBarHeight, ifIphoneX} from 'react-native-iphone-x-helper';
import SinglePickerMaterialDialog from '../../materialdialog/SinglePickerMaterialDialog';
import i18n from '../../../../resources/locales/i18n';
import {storeBlocks, clearBlocksProgram} from '../../../stores/BlocksStore';


export default class Programming extends Component {
    state = {
        device_name: getDeviceName(),
        sub_title: i18n.t('Programming.device'),
        visible: false,
        device: getDeviceName() === i18n.t('SettingsStore.noConnection') ? undefined : getDeviceName(),
        devices: [],
        instructions: instructions,
        stop_btn_disabled: true,
        blocks: blocks,
        currentRoute: "First",
        save_and_new_btn_disabled: false,
        remaining_btns_disabled: getDeviceName() === i18n.t('SettingsStore.noConnection'),
        ble_connection: {
            allowed: false,
            errormessage: '',
        },
    };

    constructor(props) {
        super(props);
        RobotProxy.testScan(err => {
                this.setState({
                    ble_connection: {
                        allowed: false,
                        errormessage: err.message,
                    },
                });
                this.openBLEErrorAlert();
                console.log('error state is set to ' + this.state.ble_connection.allowed);
            },
            dh => {
                this.setState({
                    ble_connection: {
                        allowed: true,
                        errormessage: '',
                    },
                });
                RobotProxy.stopScanning();
                console.log('state is set to ' + this.state.ble_connection.allowed);
            });
        addDeviceNameChangeListener((name) => {
            this.setState({device_name: name});
        });
        addSpeedChangeListener((instructions) => {
            this.setState({instructions: instructions});
        });
        addBlocksChangeListener((blocks) => {
            this.setState({blocks: blocks});
        })
    }


    openBLEErrorAlert() {
        Alert.alert('BLE Error', this.state.ble_connection.errormessage);
    }

    // gets the current screen from navigation state
    getActiveRouteName(navigationState) {
        if (!navigationState) {
            return null;
        }
        const route = navigationState.routes[navigationState.index];
        // dive into nested navigators
        if (route.routes) {
            return this.getActiveRouteName(route);
        }
        return route.routeName;
    }

    handleDisconnect() {
        setDeviceName({device: i18n.t('Programming.noConnection')});
        setInterval(0);
        setConnected(false);
        this.setState({
            device: undefined,
            remaining_btns_disabled: true,
            stop_btn_disabled: true,
        });
    }

    // handles messages from the communcation system
    handleCommunicationMessages(name) {
        setDeviceName({device: name.substr(name.length - 5)});
        setConnected(true);
        this.setState({
            visible: false,
            device: name,
            remaining_btns_disabled: false,
            stop_btn_disabled: true,
        });
    }

    handleResponse(res) {
        switch (res.type) {
            case 'interval':
                setInterval(res.value);
                break;
            case 'speedLine':
                add({left: res.left, right: res.right});
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
            case 'finishedUpload':
                Alert.alert(i18n.t('Programming.upload'), i18n.t('Programming.uploadMessage'));
                this.setState({
                    remaining_btns_disabled: false,
                    stop_btn_disabled: true,
                });
                break;
            default:
                break;
        }
    }

    save = ()=> {
        storeInstructions();
    }
    clear = () => {
        clearInstructions();
    }
    render() {
        return (
            <View style={[styles.container]}>
                <SinglePickerMaterialDialog
                    title={i18n.t('Programming.chooseDevice')}
                    items={this.state.devices.map((row, index) => ({
                        key: index.toString(),
                        label: row,
                        selected: false,
                    }))}
                    visible={this.state.visible && this.state.ble_connection.allowed}
                    onCancel={
                        () => {
                            this.setState({
                                visible: false,
                            });
                            RobotProxy.stopScanning();
                        }
                    }
                    onOk={
                        result => {
                            this.setState({
                                visible: false,
                            });
                            RobotProxy.stopScanning();

                            if (result.selectedLabel) {
                                setDeviceName({device: i18n.t('Programming.connecting')});
                                let deviceName = result.selectedLabel;
                                RobotProxy.setRobot(deviceName);
                                RobotProxy.connect(
                                    // callback for all messages from the robot
                                    (response) => {
                                        this.handleResponse(response);
                                    },
                                    // callback if communication is established successfully
                                    (robot) => {
                                        this.handleCommunicationMessages(robot.name);
                                    },
                                    // handle all errors
                                    (error) => {
                                        console.log('Error: ' + error);
                                        setDeviceName({device: i18n.t('Programming.noConnection')});
                                        setInterval(0);
                                        setConnected(false);
                                        this.setState({
                                            remaining_btns_disabled: true,
                                            stop_btn_disabled: true,
                                        });
                                        RobotProxy.disconnect();
                                        Alert.alert('Error', i18n.t('Programming.connectionError'));
                                    },
                                );
                            }
                        }
                    }
                    colorAccent="#9c27b0"
                />
                <Appbar>
                    <Appbar.Action icon="menu" size={32} onPress={() => this.props.navigation.openDrawer()}/>
                    <Appbar.Content style={{position: 'absolute', left: 40}} title="Explore-it" size={32}/>
                    <Appbar.Content style={{position: 'absolute', right: 40}}
                                    title={this.state.device_name}
                                    subtitle={this.state.sub_title}
                                    size={32}/>
                    <Appbar.Action icon={(this.state.device) ? 'bluetooth-connected' : 'bluetooth'}
                                   style={{position: 'absolute', right: 0}}
                                   size={32}
                        // disabled={this.state.ble_connection.allowed}
                                   onPress={() => {
                                       if (RobotProxy.isConnected) {
                                           RobotProxy.disconnect();
                                           this.handleDisconnect();
                                       } else {
                                           // init scanning for robots over ble
                                           this.setState({
                                               devices: [],
                                           });

                                           RobotProxy.scanningForRobots((error) => {
                                               console.log(error);
                                               this.setState({
                                                   ble_connection: {
                                                       allowed: false,
                                                       errormessage: error.message,
                                                   },
                                               });
                                               this.openBLEErrorAlert();
                                           }, (device) => {
                                               this.setState({
                                                   ble_connection: {
                                                       allowed: true,
                                                       errormessage: '',
                                                   },
                                               });
                                               // collect all devices found and publish them in the Dialog
                                               let devices = this.state.devices;
                                               devices.push(device);
                                               this.setState({devices: devices.sort()});
                                           });
                                           setTimeout(() => {
                                               this.setState({visible: true});
                                           }, 500);


                                       }
                                   }}/>
                </Appbar>
                <TabContainer
                    onNavigationStateChange={(prevState, currentState, action) => {
                        const currentScreen = this.getActiveRouteName(currentState);
                        const prevScreen = this.getActiveRouteName(prevState);
                        this.setState({currentRoute: currentScreen});
                        switch(currentScreen){
                            case "First":
                                this.setState({save_and_new_btn_disabled: false});
                                this.save = () => {
                                    storeInstructions();
                                }
                                this.clear = () => {
                                    clearInstructions();
                                }
                                break;
                            case "Second":
                                    this.setState({save_and_new_btn_disabled: false});
                                    this.save = () => {
                                        storeBlocks();
                                    }
                                    this.clear = () => {
                                        clearBlocksProgram();
                                    }
                                    break;
                            default:
                                    this.setState({save_and_new_btn_disabled: true});
                                    this.clear = undefined;
                                    this.save = undefined;
                                    break;
                        }
                    }}
                />
                <Appbar style={styles.bottom}>
                    <Appbar.Action icon="stop" size={32}
                                   disabled={this.state.stop_btn_disabled}
                                   onPress={() => {
                                       RobotProxy.stop().catch(e => this.handleDisconnect());
                                   }}/>
                    <Appbar.Action icon="play-arrow"
                                   size={32}
                                   disabled={this.state.remaining_btns_disabled}
                                   onPress={() => {
                                       this.setState({
                                           stop_btn_disabled: false,
                                           remaining_btns_disabled: true,
                                       });
                                       RobotProxy.run().catch(e => this.handleDisconnect());
                                   }}/>
                    <Appbar.Action icon="fiber-manual-record"
                                   size={32}
                                   disabled={this.state.remaining_btns_disabled}
                                   onPress={() => {
                                       this.setState({
                                           stop_btn_disabled: false,
                                           remaining_btns_disabled: true,
                                       });
                                       RobotProxy.record(getDuration(), getInterval()).catch(e => this.handleDisconnect());
                                   }}/>
                    <Appbar.Action icon="fast-forward"
                                   size={32}
                                   disabled={this.state.remaining_btns_disabled}
                                   onPress={() => {
                                       this.setState({
                                           stop_btn_disabled: false,
                                           remaining_btns_disabled: true,
                                       });
                                       RobotProxy.go(getLoopCounter()).catch(e => this.handleDisconnect());
                                   }}/>
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
                                   }}/>
                    <Appbar.Action icon="file-upload"
                                   size={32}
                                   disabled={this.state.remaining_btns_disabled}
                                   onPress={() => {
                                       this.setState({
                                           stop_btn_disabled: true,
                                           remaining_btns_disabled: true,
                                       });
                                       RobotProxy.upload(this.state.instructions).catch(e => {
                                           console.log(2);
                                           this.handleDisconnect();
                                       });
                                   }}/>
                    <Appbar.Action  icon="save"
                                    size={32}
                                    disabled={this.state.save_and_new_btn_disabled}
                                    onPress={() =>{
                                        this.save();
                                    }} />
                    <Appbar.Action  icon="delete"
                                    size={32}
                                    disabled={this.state.save_and_new_btn_disabled}
                                    onPress={() => {
                                        this.clear();
                                    }} />
                </Appbar>
            </View>
        );
    }
}

const TabNavigator = createMaterialTopTabNavigator({
    First: {
        screen: MainTab,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <MaterialCommunityIcon name="menu" size={24} color={tintColor}/>
            ),
        },
    },
    Second:{
        screen: SecondTab,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <MaterialCommunityIcon name="page-layout-body" size={24} color={tintColor}/>
            ),
        }
    },
    Third: {
        screen: MixedViewTab,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <MaterialCommunityIcon name="content-copy" size={24} color={tintColor}/>
            ),
        },
    },
}, {
    tabBarOptions: {
        activeTintColor: '#9c27b0',
        inactiveTintColor: 'gray',
        showLabel: false,
        indicatorStyle: {
            backgroundColor: '#9c27b0',
        },
        style: {
            backgroundColor: 'white',
        },
        showIcon: true,
    },
});

const TabContainer = createAppContainer(TabNavigator);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...ifIphoneX({
            paddingTop: getStatusBarHeight() + 10,
        }, {}),
    },
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    col: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        margin: 5,
    },
    row: {
        height: 60,
        margin: 10,
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
