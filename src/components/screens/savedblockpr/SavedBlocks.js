import React, { Component } from 'react';
import {
    StyleSheet, View, Text, TextInput, Alert,
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
import Button from './Button';
const numberOfBlocks = 9;
const items = ["Block1", "Block2", "Block3", "Block4", "Block5", "Block6", "block7", "Block8"];
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
        dataSource: {}
    };

    constructor() {
        super();
        this.openBlockly = this.openBlockly.bind(this);
    }

    openBlockly(blockname) {
        //TODO
    }


    componentDidMount() {
        this.deviceNameListener = addDeviceNameChangeListener(name => {
            this.setState({ device_name: name });
        });

        this.connectionListener = addConnectedChangeListener(value => {
            this.setState({ connected: isConnected() });
        });

        this.setState({ dataSource: items });
    }


    componentWillUnmount() {
        this.deviceNameListener.remove();
        this.connectionListener.remove();
    }

    getRandomColor = () => {
        let ColorCode = '#' + Math.random().toString(16).slice(-6);

        /* var ColorCode = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'; */
        Console.log(ColorCode);
        return ColorCode;
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
                                <Button blockname={item} openBlockly={this.openBlockly} colorHolder={this.getRandomColor} />
                            </View>
                        )}
                        //Setting the number of column
                        numColumns={2}
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


});
