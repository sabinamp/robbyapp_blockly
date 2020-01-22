import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Appbar } from 'react-native-paper';
import BlockProgramming from "./BlockProgramming";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '../../../blockly_reduxstore/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';

import {
  isConnected,
  addConnectedChangeListener,
  addDeviceNameChangeListener,
  getDeviceName,
  setDeviceName,
  setConnected,
  setInterval,
} from '../../../stores/SettingsStore';
import i18n from '../../../../resources/locales/i18n';

import RobotProxy from '../../../communication/RobotProxy';

export default class BlockPrMain extends Component {
  state = {

    device_name: getDeviceName(),
    sub_title: i18n.t('Settings.device'),
    connected: isConnected(),
    device: getDeviceName() === i18n.t('SettingsStore.noConnection') ? undefined : getDeviceName(),
    devices: [],
    visible: false,
    ble_connection: {
      allowed: false,
      errormessage: '',
    }
  };

  static navigationOptions = {
    drawerLabel: 'Blockly Blocks',
    drawerIcon: () => (
      <Icon name="extension" size={25} color="#9C27B0"
        style={styles.icon}
      />
    ),
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

  handleDisconnect() {
    setDeviceName({ device: i18n.t('Programming.noConnection') });
    setInterval(0);
    setConnected(false);
    this.setState({
      device: undefined,

    });
  }
  // handles messages from the communcation system
  handleCommunicationMessages(name) {
    setDeviceName({ device: name.substr(name.length - 5) });
    setConnected(true);
    this.setState({
      visible: false,
      device: name,

    });
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
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BlockProgramming />
          </PersistGate>
        </Provider>
      </View>
    );
  }

}
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