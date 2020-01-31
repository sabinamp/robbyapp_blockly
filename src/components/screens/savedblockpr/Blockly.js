import React, { Component } from 'react'
import { View, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView, LOAD_CACHE_ONLY } from 'react-native-webview';
const block1 = `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="repeat" x="30" y="50">
  <field name="Loop">Loop</field>
  <field name="i">15</field>
  <statement name="DO">
    <block type="set_speeds2" id="_$a:2lHW0)Nd{qXA4]b0">
      <field name="leftSpeed"> left</field>
      <field name="leftWheelSpeed2">50</field>
      <field name="rightSpeed">right</field>
      <field name="rightWheelSpeed2">25</field>
    </block>
  </statement>
</block>
</xml>`;

const block_steps1 = [
  { left: 50, right: 25 },
  { left: 50, right: 25 },
  { left: 50, right: 25 },
  { left: 50, right: 25 },
  { left: 50, right: 25 },
  { left: 50, right: 25 },
  { left: 50, right: 25 },
  { left: 50, right: 25 },
  { left: 50, right: 25 },
  { left: 50, right: 25 },
  { left: 50, right: 25 },
  { left: 50, right: 25 },
  { left: 50, right: 25 },
  { left: 50, right: 25 },
  { left: 50, right: 25 }];
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

export default class Blockly extends React.Component {
  componentDidMount() {

    const { block_xml } = this.props;
    const loadWorkspace = `window.onload=loadWorkspace(block_xml);  true;`;
    if (block_xml) this.webref.injectJavaScript(loadWorkspace);
    console.log("BlocklyWebview prop block_xml is" + block_xml);
  }

  render() {

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
          //injectedJavaScript={runFirst}
          onMessage={event => {
            const { data } = event.nativeEvent;
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
    height: 450,

  },
  text: {
    color: '#fff',
    textAlign: 'center'
  },

});




