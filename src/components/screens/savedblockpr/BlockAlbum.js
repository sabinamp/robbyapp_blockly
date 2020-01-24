import React, { Component } from 'react';
import {
  StyleSheet, View, Text, TextInput, Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

import Button from './Button';
import { connect } from 'react-redux';

import { blockReducer } from '../../../blockly_reduxstore/reducers';
import { addBlock, loadBlocks, getBlock, removeBlock, updateBlock } from '../../../blockly_reduxstore/BlockActions';


class BlockAlbum extends Component {
  state = {
    dataSource: []
  }
  constructor() {
    super();
    this.openBlockly = this.openBlockly.bind(this);
  }

  openBlockly(blockname) {
    //TODO
  }

  getRandomColor = () => {
    let ColorCode = '#' + Math.random().toString(16).slice(-6);

    /* var ColorCode = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'; */
    Console.log(ColorCode);
    return ColorCode;
  }

  componentDidMount() {
    setTimeout(() => {
      let currentBlocks = this.props.loadBlocks();
      //let currentBlocks = ["Block2", "Block2", "Block3", "Block4"];
      if (currentBlocks.length > 0)
        this.setState({ dataSource: currentBlocks });
    }, 5000);

  }
  /*  componentWillUnmount() {
     clearInterval(this.interval);
   } */

  removeBlock = (name) => {
    this.props.removeBlock(name);
  }

  render() {
    return (
      <View style={{ flex: 1, padding: 40, justifyContent: 'center' }}>

        <FlatList data={this.state.dataSource}
          renderItem={({ item }) => (
            <View style={{ flex: 1, flexDirection: 'column', margin: 5 }}>
              <Button blockname={item.block_name} openBlockly={this.openBlockly} colorHolder={this.getRandomColor}
              />
            </View>
          )}
          //Setting the number of column
          numColumns={1}
          keyExtractor={(item, index) => index}
        />

      </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    blocks: state.blockReducer,
    speeds: state.speedReducer
  };
};
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
  return {
    loadBlocks: () => dispatch(loadBlocks()),
    addBlock: (block) => dispatch(addBlock(block)),
    removeBlock: (name) => dispatch(removeBlock(name)),
    updateBlock: (blockname) => dispatch(updateBlock(blockname)),
    getBlock: (blockname) => dispatch(getBlock(blockname)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockAlbum);