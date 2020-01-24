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

  /*   componentDidMount() {
      let currentBlocks = [];
      setTimeout(() => {
        currentBlocks = this.props.loadBlocks();
      }, 5000);
      if (currentBlocks.length > 0)
        this.setState({ dataSource: currentBlocks });
  
    } */

  componentDidMount() {
    this.onLoad();
  }
  onLoad = () => {
    try {
      let currentBlocks = this.props.loadBlocks();
      if (currentBlocks.length > 0) this.setState({ dataSource: currentBlocks });
    } catch (error) {
      Alert.alert('Error', 'There was an error while loading thedata.');
    }
  }

  /*  componentWillUnmount() {
     clearInterval(this.interval);
   } */

  removeBlock = (name) => {
    this.props.removeBlock(name);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps='always'
          style={styles.content}>
          <FlatList data={this.state.dataSource}
            renderItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: 'column', margin: 5 }}>
                <Button blockname={item.block_name} openBlockly={this.openBlockly} colorHolder={this.getRandomColor()}

                />
              </View>
            )}
            //Setting the number of column
            numColumns={2}
            keyExtractor={(item, index) => index}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
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