import React, { Component } from 'react'
import { View, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView, LOAD_NO_CACHE, LOAD_CACHE_ONLY } from 'react-native-webview';

const isAndroid = Platform.OS === 'android'
const window = Dimensions.get("window");

const blocklywebapp = {
  link: isAndroid ? 'file:///android_asset/blocksv/index.html'
    : './blocksv/index.html'
};

/* const runFirst = this.props.block_xml.length
? `
${blocklyStart}
${blocklySetStates}
${blocklyGetStates}
window.onload = function() {
var xml_text = '${this.props.block_xml.replace(/\'/g, `\'`)}';
var xml = Blockly.Xml.textToDom(xml_text);
demoWorkspace.clear();
Blockly.Xml.domToWorkspace(xml, demoWorkspace);
}
`
: `
${blocklyStart}
${blocklySetStates}
${blocklyGetStates}
window.onload = function() {
demoWorkspace.clear();
var startBlock = Blockly.Block.obtain(demoWorkspace, 'start');
startBlock.initSvg();
startBlock.render();
}`; */

// restore workspace
/* const runFirst = '
window.onload = function restoreWorkspace(block_xml) {  
  Blockly.mainWorkspace.clear();
  let textToDom = Blockly.Xml.textToDom(block_xml);
  Blockly.Xml.domToWorkspace(textToDom, Blockly.mainWorkspace);

} */

const BlocklyWebView = ({ receiveCodeAsString }) => {
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
        cacheMode={LOAD_CACHE_ONLY}
        javaScriptEnabledAndroid={true}
        onMessage={event => {
          const { data } = event.nativeEvent;
          { receiveCodeAsString(data) };
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



