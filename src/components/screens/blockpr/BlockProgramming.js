import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { Appbar } from 'react-native-paper';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';
import {
  isConnected,
  addConnectedChangeListener,
} from '../../../stores/SettingsStore';
import {
  getDeviceName,
  addDeviceNameChangeListener,
} from '../../../stores/SettingsStore';
import i18n from '../../../../resources/locales/i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class BlockProgramming extends Component {
  static navigationOptions = {
    drawerLabel: 'Code Blocks',
    drawerIcon: () => (
      <Icon name="extension" size={25} color="#9C27B0"
        style={styles.icon}
      />
    ),
  };

  state = {
    device_name: getDeviceName(),
    sub_title: i18n.t('Settings.device'),
    connected: isConnected(),
  };
  constructor() {
    super();
    addDeviceNameChangeListener(name => {
      this.setState({ device_name: name });
    });
    addConnectedChangeListener(value => {
      this.setState({ connected: isConnected() });
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

        <View style={{ flex: 1, padding: 40 }}>
        </View>
      </View>);

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

});
