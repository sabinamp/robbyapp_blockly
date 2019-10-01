/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import * as React from 'react';
import {name as appName} from './app.json';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#9c27b0',
        accent: '#f50057',
    },
};

export default function Main() {
    return (
        <PaperProvider theme={theme}>
            <App/>
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);
