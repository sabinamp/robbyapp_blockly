import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Appbar, Provider } from 'react-native-paper';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';
import {
  isConnected,
  addConnectedChangeListener,
  addDeviceNameChangeListener,
  getDeviceName,
  setDeviceName,
  setConnected,
  getLoopCounter,
  getDuration,
  getInterval,
  setInterval,
} from '../../../stores/SettingsStore';
import i18n from '../../../../resources/locales/i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RobotProxy from '../../../communication/RobotProxy';
//import { speeds, add, removeAll } from '../../../stores/BlocklySpeedsStore';
import SinglePickerMaterialDialog from '../../materialdialog/SinglePickerMaterialDialog';
import BlockComp from './BlockComp';
import { connect } from 'react-redux';
import { addBlock, loadBlocks, removeBlock, updateBlock, getBlock } from '../../../blockly_reduxstore/BlockActions';

class BlockProgramming extends Component {

  static navigationOptions = {
    drawerLabel: 'Blockly Blocks',
    drawerIcon: () => (
      <Icon name="extension" size={25} color="#9C27B0"
        style={styles.icon}
      />
    ),
  };

  state = {
    device_name: getDeviceName(),
    /*  sub_title: i18n.t('Settings.device'), */
    connected: isConnected(),
    device: getDeviceName() === i18n.t('SettingsStore.noConnection') ? undefined : getDeviceName(),
    devices: [],
    visible: false,
    speeds: [],
    stop_btn_disabled: true,
    savebtn_disabled: false,
    persistbtn_disabled: true,
    remaining_btns_disabled: getDeviceName() === i18n.t('SettingsStore.noConnection'),
    ble_connection: {
      allowed: false,
      errormessage: '',
    }
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
    this.updateCurrentSpeeds = this.updateCurrentSpeeds.bind(this);
    this.addBlockToStore = this.addBlockToStore.bind(this);
    this.handleSaveClicked = this.handleSaveClicked.bind(this);
    this.handleAddToCollectionClicked = this.handleAddToCollectionClicked.bind(this);

  }

  componentDidMount() {
    this.deviceNameChangedListener = addDeviceNameChangeListener((name) => {
      this.setState({ device_name: name });
    });
    this.deviceConnectedListener = addConnectedChangeListener(value => {
      this.setState({ connected: isConnected() });
    });

  }

  componentWillUnmount() {
    this.deviceNameChangedListener.remove();
    this.deviceConnectedListener.remove();
  }

  handleSaveClicked() {
    this.setState({
      remaining_btns_disabled: false,
      stop_btn_disabled: true,
      savebtn_disabled: true,
      persistbtn_disabled: false
    });
    const get_workspacedata = `sendGeneratedCodetoRN(); `;
    this.blocklycomp.webviewref.webref.injectJavaScript(get_workspacedata);
    console.log("request generated code sent to the web app");
  }

  handleAddToCollectionClicked() {
    this.setState({
      remaining_btns_disabled: false,
      stop_btn_disabled: true,
      savebtn_disabled: false,
      persistbtn_disabled: true
    });
    const get_speeds = `sendWorkspacetoRN(); `;
    this.blocklycomp.webviewref.webref.injectJavaScript(get_speeds);
    console.log("request workspace injected to the web app");

  }

  updateCurrentSpeeds(steps) {
    (steps.length == 0) ?
      (Alert.alert('Empty workspace', " Please build a program first!"))
      :
      this.setState({ speeds: steps });
    console.log("current speeds updated.Steps:" + steps);
    Alert.alert('Current Speeds', "The current speeds-updated");

  }

  openBLEErrorAlert() {
    Alert.alert('BLE Error', this.state.ble_connection.errormessage);
  }


  handleDisconnect() {
    setDeviceName({ device: i18n.t('Programming.noConnection') });
    setInterval(0);
    setConnected(false);
    this.setState({
      device: undefined,
      remaining_btns_disabled: true,
      stop_btn_disabled: true,
      savebtn_disabled: false,
      persistbtn_disabled: true
    });
  }

  // handles messages from the communication system
  handleCommunicationMessages(name) {
    setDeviceName({ device: name.substr(name.length - 5) });
    setConnected(true);
    this.setState({
      visible: false,
      device: name,
      remaining_btns_disabled: false,
      stop_btn_disabled: true,
      savebtn_disabled: false,
      persistbtn_disabled: true
    });
  }

  addBlockToStore(block) {
    //save block in redux store with an automatically generated name    
    (block.block_steps.length > 0) ?
      this.props.addBlock(block)
      : Alert.alert("Please save a block first.");
    Alert.alert('Saving', "Successfully saved a new block.");
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
          savebtn_disabled: true,
          persistbtn_disabled: true
        });
        Alert.alert(i18n.t('Programming.download'), i18n.t('Programming.downloadMessage'));
        break;
      case 'finishedDriving':
        Alert.alert(i18n.t('Programming.drive'), i18n.t('Programming.driveMessage'));
        this.setState({
          remaining_btns_disabled: false,
          stop_btn_disabled: true,
          savebtn_disabled: false,
          persistbtn_disabled: true
        });
        break;
      case 'stop':
        this.setState({
          remaining_btns_disabled: false,
          stop_btn_disabled: true,
          savebtn_disabled: false,
          persistbtn_disabled: true
        });
        break;
      case 'finishedLearning':
        Alert.alert(i18n.t('Programming.record'), i18n.t('Programming.recordMessage'));
        this.setState({
          remaining_btns_disabled: false,
          stop_btn_disabled: true,
          savebtn_disabled: true,
          persistbtn_disabled: true
        });
        break;
      case 'finishedUpload':
        Alert.alert(i18n.t('Programming.upload'), i18n.t('Programming.uploadMessage'));
        this.setState({
          remaining_btns_disabled: false,
          stop_btn_disabled: true,
          savebtn_disabled: true,
          persistbtn_disabled: false
        });
        break;
      default:
        break;
    }
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
                setDeviceName({ device: i18n.t('Programming.connecting') });
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
                    setDeviceName({ device: i18n.t('Programming.noConnection') });
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

        <View style={styles.container}>
          <BlockComp block_name={this.props.block.block_name} block_steps={this.props.block.block_steps}
            ref={r => (this.blocklycomp = r)}
            block_xml={this.props.block.block_xml} updateCurrentSpeeds={this.updateCurrentSpeeds} addBlockToStore={this.addBlockToStore}

          />
        </View>

        <Appbar style={styles.bottom}>
          <Appbar.Action icon="stop" size={32}
            disabled={this.state.stop_btn_disabled}
            onPress={() => {
              RobotProxy.stop().catch(e => this.handleDisconnect());
            }} />

          <Appbar.Action icon="save"
            size={32}
            disabled={this.state.remaining_btns_disabled}
            onPress={() => {
              this.setState({
                stop_btn_disabled: true,
                remaining_btns_disabled: false,
                savebtn_disabled: false,
                persistbtn_disabled: false
              });
              this.handleSaveClicked();
            }}

          />

          <Appbar.Action icon="library-add"
            size={32}
            disabled={this.state.persistbtn_disabled}
            onPress={() => {
              this.setState({
                stop_btn_disabled: true,
                remaining_btns_disabled: false,
                savebtn_disabled: true,
                persistbtn_disabled: true
              });
              this.handleAddToCollectionClicked();
            }}
          />
          <Appbar.Action icon="file-upload"
            size={32}
            disabled={this.state.remaining_btns_disabled}
            onPress={() => {
              this.setState({
                stop_btn_disabled: true,
                remaining_btns_disabled: true,
              });
              if (this.state.speeds.length !== 0) {
                RobotProxy.upload(this.state.speeds).catch(e => {
                  console.log(2);
                  this.handleDisconnect();
                });
              } else {
                Alert.alert("Warning", "There is nothing to upload.");
                this.setState({
                  stop_btn_disabled: true,
                  remaining_btns_disabled: true,
                  savebtn_disabled: false,
                  persistbtn_disabled: true,
                });
              }
            }} />
          <Appbar.Action icon="fast-forward"
            size={32}
            disabled={this.state.remaining_btns_disabled}
            onPress={() => {
              this.setState({
                stop_btn_disabled: false,
                remaining_btns_disabled: true,
              });
              RobotProxy.go(getLoopCounter()).catch(e => this.handleDisconnect());
            }} />
          <Appbar.Action icon={(this.state.device) ? 'bluetooth-connected' : 'bluetooth'}
            style={{ position: 'absolute', right: 0 }}
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
                  this.setState({ devices: devices.sort() });
                });
                setTimeout(() => {
                  this.setState({ visible: true });
                }, 500);

              }
            }} />
        </Appbar>

      </View>);

  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 0,

  },
  icon: {
    padding: 0,
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

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
  return {
    blocks: state.blocksReducer
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addBlock: (block) => dispatch(addBlock(block)),
    removeBlock: (block_name) => dispatch(removeBlock(block_name)),
    updateBlock: (block) => dispatch(updateBlock(block)),
    getBlock: (block_name) => dispatch(getBlock(block_name)),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockProgramming);