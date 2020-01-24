import React, { Component } from 'react';
import { StyleSheet, View, } from 'react-native';

import { Appbar } from 'react-native-paper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '../../../blockly_reduxstore/store';
import {
    isConnected,
    addConnectedChangeListener,
    addDeviceNameChangeListener,
    getDeviceName,

} from '../../../stores/SettingsStore';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';
import i18n from '../../../../resources/locales/i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BlockAlbum from './BlockAlbum';

export default class SavedBlocks extends Component {
    static navigationOptions = {
        drawerLabel: 'My Blockly Blocks',
        drawerIcon: () => (
            <Icon style={styles.icon} name="view-module" size={25} color="#9C27B0" />
        )
    }
    state = {
        device_name: getDeviceName(),
        sub_title: i18n.t('Settings.device'),
        connected: isConnected(),
    };

    constructor() {
        super();
        this.openBlockly = this.openBlockly.bind(this);
    }

    openBlockly(blockname) {
        //TODO
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
        this.deviceNameListener = addDeviceNameChangeListener(name => {
            this.setState({ device_name: name });
        });

        this.connectionListener = addConnectedChangeListener(value => {
            this.setState({ connected: isConnected() });
        });


    }


    componentWillUnmount() {
        this.deviceNameListener.remove();
        this.connectionListener.remove();
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
                        <BlockAlbum />
                    </PersistGate>
                </Provider>

                <Appbar style={styles.bottom}>
                </Appbar>
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
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },


});
