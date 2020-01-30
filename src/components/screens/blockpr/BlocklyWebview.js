import React, { Component } from 'react'
import { View, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView, LOAD_CACHE_ONLY } from 'react-native-webview';

const isAndroid = Platform.OS === 'android';
const isiOS = Platform.OS === 'ios';
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

    const { block_xml } = this.props;
    const loadWorkspace = `Blockly.Xml.clearWorkspaceAndLoadFromXml( Blockly.getMainWorkspace(),Blockly.Xml.textToDom(block_xml));`;
    if (block_xml.length) this.webref.injectJavaScript(loadWorkspace);
    console.log("BlocklyWeview prop block_xml is" + block_xml);

  }

  render() {
    const { block_xml, receiveCodeAsString } = this.props;
    /*  const runFirst = (block_xml.length === 0) ?
       `window.isNativeApp = true; `
       :
       `window.isNativeApp = true;   
       Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.textToDom(block_xml), Blockly.getMainWorkspace());
      `; */
    const runFirst = `window.isNativeApp = true; `

    return (
      <View style={styles.container}>
        <WebView source={{ uri: blocklywebapp.link }} allowFileAccess={true}
          ref={r => (this.webref = r)}
          style={{ marginBottom: 30 }} textZoom={100}
          scalesPageToFit={true}
          startInLoadingState={true}
          renderLoading={LoadingIndicatorView}
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




