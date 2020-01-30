import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Modal, Alert,
  FlatList, SafeAreaView, RefreshControl,
  TouchableOpacity
} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import Button from './Button';
import { connect } from 'react-redux';

import { blockReducer } from '../../../blockly_reduxstore/reducers';
import { addBlock, loadBlocks, getBlock, removeBlock, updateBlock } from '../../../blockly_reduxstore/BlockActions';
import Blockly from './Blockly';

const getRandomColor = () => {
  let ColorCode = '#' + Math.random().toString(16).slice(-6);

  /*   var ColorCode = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'; */
  console.log(ColorCode);
  return ColorCode;
}


class BlockAlbum extends Component {

  state = {
    dataSource: [],
    modalVisible: false,
    isRefreshing: false,
  }

  constructor() {
    super();

  }

  UNSAFE_componentWillMount() {
    this.onLoad();
    console.log("There are " + this.state.dataSource.length + "blocks.");
  }

  onLoad = () => {
    this.setState({ dataSource: this.props.blocks });
  }

  componentDidMount() {
    console.log("There are " + this.state.dataSource.length + "blocks.");
  }


  onDeleteItem(item) {
    this.props.removeBlock(item.name);
    this.onLoad();
  }

  openModal() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  removeBlock = (name) => {
    this.props.removeBlock(name);
  }

  onRefresh() {
    this.setState({ isRefreshing: true }); // true isRefreshing flag for enable pull to refresh indicator    
    let data = this.props.blocks;
    this.setState({ dataSource: data });
    this.setState({ isRefreshing: false });//flag to disable pull to refresh indicator
  }

  renderItem(item) {
    return (
      <View style={{ flex: 1, flexDirection: 'column', margin: 4 }}>
        <Button blockname={item.block_name} colorHolder={getRandomColor()}
          onPress={() => this.openModal()}
        />
        {/*             <Modal visible={this.state.modalVisible}
          animationType={'slide'}
          onRequestClose={() => this.closeModal()} >
          <Blockly block={item} />
          <Button
            onPress={() => this.props.navigation.goBack()}
            title="Dismiss"
          />
        </Modal>  */}
      </View>

    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList data={this.state.dataSource} extraData={this.state}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          renderItem={({ item }) => this.renderItem(item)}
          keyExtractor={item => item.blockid}
          //Setting the number of columns
          numColumns={1}
        />

      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',

  },
  content: {
    flex: 1
  },

});

const mapStateToProps = (state) => {
  return {
    blocks: state.blocksReducer,

  };
};

// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
  return {
    addBlock: (block) => dispatch(addBlock(block)),
    removeBlock: (name) => dispatch(removeBlock(name)),
    updateBlock: (blockname) => dispatch(updateBlock(blockname)),
    getBlock: (blockname) => dispatch(getBlock(blockname)),
    loadBlocks: () => dispatch(loadBlocks()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockAlbum);