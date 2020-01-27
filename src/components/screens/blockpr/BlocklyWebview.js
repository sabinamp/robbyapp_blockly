import React, { Component } from 'react'
import { View, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView, LOAD_NO_CACHE, LOAD_CACHE_ONLY } from 'react-native-webview';

const isAndroid = Platform.OS === 'android'
const window = Dimensions.get("window");
const LoadingIndicatorView = () => (
  <ActivityIndicator
    color="#009b88"
    size="large"
    style={styles.ActivityIndicatorStyle}
  />
);
const blocklywebapp = {
  link: isAndroid ? 'file:///android_asset/blocksv/index.html'
    : './blocksv/index.html'
};

export default class BlocklyWebView extends React.Component {

  componentDidMount() {

  }

  render() {
    const { block_xml, receiveCodeAsString } = this.props;
    const runFirst = ({ block_xml }.length === 0) ?
      `window.isNativeApp = true;
    `
      :
      `window.isNativeApp = true;   
    window.onload = function(block_xml) {      
    Blockly.mainWorkspace.clear();
    let textToDom = Blockly.Xml.textToDom(block_xm});
    Blockly.Xml.domToWorkspace(textToDom, Blockly.mainWorkspace);
  }
  `;


    return (
      <View style={styles.container}>
        <WebView source={{ uri: blocklywebapp.link }} allowFileAccess={true}
          ref={r => (this.webref = r)}
          style={{ marginBottom: 30 }} textZoom={100}
          scalesPageToFit={true}
          renderLoading={LoadingIndicatorView}
          startInLoadingState={true}
          cacheMode={LOAD_CACHE_ONLY}
          javaScriptEnabledAndroid={true}
          injectedJavaScript={runFirst}
          onMessage={event => {
            const { data } = event.nativeEvent;
            { receiveCodeAsString(data) };
            console.log("the code from the web app :" + data);
          }}
        />
      </View>
    )
  }
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

  },
  text: {
    color: '#fff',
    textAlign: 'center'
  },

});




