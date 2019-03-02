import React, {Component} from 'react';
import { createDrawerNavigator, createAppContainer, DrawerItems} from "react-navigation";
import Programming from "./Components/Screens/Programming/Programming";
import Settings from "./Components/Screens/Settings/Settings";
import BleService from "./communication/BleService";
import {set_update_device_name_callback, device_name} from "./Stores/SettingsStore";
import { View, Text } from "react-native";
import {getStatusBarHeight, ifIphoneX} from "react-native-iphone-x-helper";

export default class App extends Component {
    state = {device: undefined};

    componentWillMount() {
        BleService.requestLocationPermission();
    }
    render() {return (<DrawerContainer />);}
}

class DrawerContent extends Component {
    state = {
        device_name: device_name,
    };
    constructor() {
        super();

        set_update_device_name_callback((name) => {
            this.setState({ device_name: name });
        });
    }

    render() {
        return (
            <View>
                <View
                    style={{
                        backgroundColor: '#9c27b0',
                        height: 140,
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...ifIphoneX({
                            paddingTop: getStatusBarHeight() + 10,
                        }, {

                        })
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 30 }}>
                        {this.state.device_name}
                    </Text>
                </View>
                <DrawerItems {...this.props} />
            </View>
        );
    }
}

const DrawerNavigator = createDrawerNavigator({
    Programmieren: {screen: Programming},
    Einstellungen: {screen: Settings},
},{
    contentComponent: DrawerContent,
});

const DrawerContainer = createAppContainer(DrawerNavigator);
