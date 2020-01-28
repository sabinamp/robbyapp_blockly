import React, { Component } from 'react';
import {
  StyleSheet, View, Text, TextInput, Alert,
  FlatList, SafeAreaView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

import Button from './Button';
import { connect } from 'react-redux';

import { blockReducer } from '../../../blockly_reduxstore/reducers';
import { addBlock, loadBlocks, getBlock, removeBlock, updateBlock } from '../../../blockly_reduxstore/BlockActions';

const getRandomColor = () => {
  let ColorCode = '#' + Math.random().toString(16).slice(-6);

  /*   var ColorCode = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'; */
  console.log(ColorCode);
  return ColorCode;
}

const Item = ({ title }) => {
  return (
    <View style={{ flex: 1, flexDirection: 'column', margin: 5 }}>
      <Button blockname={title} openBlockly={this.openBlockly} colorHolder={getRandomColor()}
      />
    </View>
  );
}
class BlockAlbum extends Component {
  state = {
    dataSource: []
  }
  constructor() {
    super();
    this.openBlockly = this.openBlockly.bind(this);
  }

  openBlockly(block) {
    //TODO
  }

  UNSAFE_componentWillMount() {
    this.onLoad();
  }

  onLoad = () => {
    /*  setTimeout(() => { */

    this.setState({ dataSource: this.props.blocks });
    /* }, 5000); */

  }
  componentDidMount() {
    console.log("There are " + this.state.dataSource.length + "blocks.");
  }


  removeBlock = (name) => {
    this.props.removeBlock(name);
  }


  render() {
    return (

      <SafeAreaView style={styles.container}>
        <FlatList data={this.state.dataSource}
          renderItem={({ item }) => <Item title={item.block_name} />}

          //Setting the number of columns
          numColumns={2}
          keyExtractor={item => item.blockid}
          onPress={openBlockly(item)}
        />
      </SafeAreaView>

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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockAlbum);