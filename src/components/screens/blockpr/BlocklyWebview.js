import React, { Component } from 'react'
import { View, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const isAndroid = Platform.OS === 'android'
const window = Dimensions.get("window");

const blocklywebapp = {
  link: isAndroid ? 'file:///android_asset/blocksv/index.html'
    : './blocksv/index.html'
};


const BlocklyWebView = ({ receiveStringData }) => {
  const LoadingIndicatorView = () => (
    <ActivityIndicator
      color="#009b88"
      size="large"
      style={styles.ActivityIndicatorStyle}
    />
  );

  return (
    <View style={styles.container}>
      <WebView source={{ uri: blocklywebapp.link }} allowFileAccess={true}
        style={{ marginBottom: 30 }} textZoom={100}
        scalesPageToFit={true}
        renderLoading={LoadingIndicatorView}
        startInLoadingState={true}
        javaScriptEnabledAndroid={true}
        onMessage={event => {
          const { data } = event.nativeEvent;
          console.log(data);
          receiveStringData(data);
          console.log("code from the web app :" + data);
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  ActivityIndicatorStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',

  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  text: {
    color: '#fff',
    textAlign: 'center'
  },

});
export default BlocklyWebView;



