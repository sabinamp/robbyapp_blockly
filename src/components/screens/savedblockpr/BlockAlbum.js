import React, { Component } from 'react';
import {
  StyleSheet, View, Text, TextInput, Alert,
  FlatList, SafeAreaView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import Button from './Button';
import { connect } from 'react-redux';

import { blockReducer } from '../../../blockly_reduxstore/reducers';
import { addBlock, loadBlocks, getBlock, removeBlock, updateBlock } from '../../../blockly_reduxstore/BlockActions';
import Blockly from './Blockly'

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
  }
  constructor() {
    super();

  }

  UNSAFE_componentWillMount() {
    this.onLoad();
  }

  onLoad = () => {
    /*  setTimeout(() => { */

    this.setState({ dataSource: this.props.loadBlocks() });
    /* }, 5000); */

  }
  componentDidMount() {
    console.log("There are " + this.state.dataSource.length + "blocks.");
  }
  onDeleteItem(item) {
    this.props.removeBlock(item.name);
    this.onLoad();
  }

  renderItem(item) {
    return (
      <View style={styles.container}>
        <Modal visible={this.state.modalVisible}
          animationType={'slide'}
          onRequestClose={() => this.closeModal()}
          block={item}
        ></Modal>
        <View style={{ flex: 1, flexDirection: 'column', margin: 5 }}>
          <Button blockname={item.block_name} colorHolder={getRandomColor()}
            onPress={() => this.openModal(item)}
          />
        </View>
      </View>
    );
  }


  openModal(item) {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  removeBlock = (name) => {
    this.props.removeBlock(name);
  }


  render() {
    return (
      <SafeAreaView style={styles.container}>

        <FlatList data={this.state.dataSource}
          renderItem={({ item }) => this.renderItem(item)}

          //Setting the number of columns
          numColumns={2}
          keyExtractor={item => item.blockid}
        />
      </SafeAreaView>

    );
  }
}
class ModalScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Blockly block={this.props.block} />
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
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