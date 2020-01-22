import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { DrawerNavigatorItems, createDrawerNavigator } from 'react-navigation-drawer';
import Programming from './src/components/screens/programming/Programming';
import Settings from './src/components/screens/settings/Settings';
import BlockPrMain from './src/components/screens/blockpr/BlockPrMain';
import BleService from './src/communication/BleService';
import {
    addDeviceNameChangeListener,
    getDeviceName,
} from './src/stores/SettingsStore';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';
// import {version} from './package.json';
import i18n from './resources/locales/i18n';
import GLOBAL from './src/utility/Global';

import * as ut from './src/utility/AppSettings';
import SavedBlocks from './src/components/screens/savedblockpr/SavedBlocks';


export default class App extends Component {
    state = { device: undefined };

    componentDidMount() {
        BleService.requestLocationPermission();
    }

    render() {
        return <DrawerContainer />;
    }
}

class DrawerContent extends Component {
    state = {
        device_name: getDeviceName(),
    };

    constructor() {
        super();
        console.log('Welcome to ' + GLOBAL.SHORT_APP_NAME);

        addDeviceNameChangeListener(name => {
            this.setState({ device_name: name });
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.deviceName}>
                    <Text style={{ color: 'white', fontSize: 30 }}>
                        {this.state.device_name}
                    </Text>
                </View>
                <View style={styles.drawerItems}>
                    <DrawerNavigatorItems {...this.props} />
                </View>
                <View style={styles.footer}>
                    <Text
                        style={{
                            flex: 1,
                            marginLeft: 15,
                            color: 'white',
                            fontWeight: 'bold',
                        }}>
                        {GLOBAL.APP_NAME}
                    </Text>
                    <Text
                        style={{
                            flex: 1,
                            textAlign: 'right',
                            marginRight: 15,
                            color: 'white',
                            fontWeight: 'bold',
                        }}>
                        v{GLOBAL.VERSION}
                    </Text>
                </View>
            </View>
        );
    }
}

const DrawerNavigator = createDrawerNavigator(
    {
        [i18n.t('App.programming')]: { screen: Programming },
        [i18n.t('App.settings')]: { screen: Settings },
        [i18n.t('App.blockprogramming')]: { screen: BlockPrMain },
        [i18n.t('App.savedblocks')]: { screen: SavedBlocks },
    },
    {
        contentComponent: DrawerContent,
    },
);

const DrawerContainer = createAppContainer(DrawerNavigator);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    deviceName: {
        flex: 1,
        backgroundColor: '#9c27b0',
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        ...ifIphoneX(
            {
                paddingTop: getStatusBarHeight() + 10,
            },
            {},
        ),
    },
    drawerItems: {
        flex: 3,
        flexDirection: 'column',
    },
    footer: {
        backgroundColor: '#9c27b0',
        height: 50,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#9c27b0',
        flexDirection: 'row',
    },
});
