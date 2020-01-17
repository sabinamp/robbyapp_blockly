import React, { Component } from 'react';
import {
    StyleSheet, View, Text, TextInput, Alert,
    View,
    FlatList,
    ActivityIndicator,
    Image,
    TouchableOpacity
} from 'react-native';
import { Appbar } from 'react-native-paper';

import {
    isConnected,
    addConnectedChangeListener,
    addDeviceNameChangeListener,
    getDeviceName,
    setDeviceName,
    setConnected,

} from '../../../stores/SettingsStore';

//import CalibrationInput from './CalibrationInput';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';
import i18n from '../../../../resources/locales/i18n';
import RobotProxy from '../../../communication/RobotProxy';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class SavedBlocks extends Component {
    static navigationOptions = {
        drawerLabel: 'My Blockly Blocks',
        drawerIcon: () => (
            <Icon style={styles.icon} name="extension" size={25} color="#9C27B0" />
        )
    }
    state = {
        device_name: getDeviceName(),
        sub_title: i18n.t('Settings.device'),
        connected: isConnected(),
        dataSource: {}
    };

    constructor() {
        super();

    }

    componentDidMount() {
        this.deviceNameListener = addDeviceNameChangeListener(name => {
            this.setState({ device_name: name });
        });

        this.connectionListener = addConnectedChangeListener(value => {
            this.setState({ connected: isConnected() });
        });
        let items = Array.apply(null, Array(60)).map((v, i) => {
            return { id: i, src: 'http://placehold.it/200x200?text=' + (i + 1) };
        });
        this.setState({ dataSource: items });
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

                <View style={{ flex: 1, padding: 40, justifyContent: 'center' }}>
                    <FlatList data={this.state.dataSource}
                        renderItem={({ item }) => (
                            <View style={{ flex: 1, flexDirection: 'column', margin: 5 }}>
                                <Image style={styles.imageThumbnail} source={{ uri: item.src }} />
                            </View>
                        )}
                        //Setting the number of column
                        numColumns={3}
                        keyExtractor={(item, index) => index}
                    />

                </View>
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
    imageThumbnail: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },

});
