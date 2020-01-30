import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Modal, Alert,
  FlatList, SafeAreaView, RefreshControl,
  TouchableOpacity
} from 'react-native';
import Button from './Button';
import { connect } from 'react-redux';

import { blockReducer } from '../../../blockly_reduxstore/reducers';
import { addBlock, loadBlocks, getBlock, removeBlock, updateBlock } from '../../../blockly_reduxstore/BlockActions';
import Blockly from './Blockly';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger, MenuProvider
} from 'react-native-popup-menu';


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

  constructor(props) {
    super(props);
    this.onRefresh = this.onRefresh.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.blocks !== state.dataSource) {
      return {
        dataSource: props.blocks,
      };
    }
    // Return null if the state hasn't changed
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.blocks === nextProps.blocks) {
      return false;
    }
    return true;
  }

  componentDidMount() {
    console.log("There are " + this.state.dataSource.length + "blocks.");
  }


  onDeleteItem(name) {
    this.props.removeBlock(name);
    this.onRefresh();
  }

  openModal() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }


  onRefresh() {
    let data = this.props.blocks;
    this.setState({ isRefreshing: true, dataSource: data }); // true isRefreshing flag for enable pull to refresh indicator    

    this.setState({ isRefreshing: false });//flag to disable pull to refresh indicator
  }

  renderItem(item) {
    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'stretch', margin: 4 }}>

        <Menu style={{ alignSelf: 'flex-end', fontsize: '20', color: '#9C27B0' }}>
          <MenuTrigger text='Select action:' />
          <MenuOptions>
            <MenuOption text='Open' onSelect={() => this.openModal()} />
            <MenuOption text='Delete' onSelect={() => this.onDeleteItem(item.block_name)} />
          </MenuOptions>
        </Menu>
        <Button style={{ alignSelf: 'flex-start' }} blockname={item.block_name} colorHolder={getRandomColor()} />


        <Modal visible={this.state.modalVisible} style={{ flex: 1, justifyContent: 'center' }}
          animationType={'slide'}
          onRequestClose={() => this.closeModal()} >
          <Blockly block={item} />
          <Button
            onPress={() => this.props.navigation.goBack()}
            title="Dismiss"
          />
        </Modal>
      </View>

    );
  }

  render() {
    return (
      <MenuProvider>
        <SafeAreaView style={styles.container}>
          <FlatList data={this.state.dataSource} extraData={this.state}
            refreshControl={
              <RefreshControl
                enabled={true}
                refreshing={this.state.isRefreshing}
                onRefresh={this.onRefresh}
              />
            }
            renderItem={({ item }) => this.renderItem(item)}
            keyExtractor={item => item.blockid.toString()}
            //Setting the number of columns
            numColumns={1}
          />

        </SafeAreaView>
      </MenuProvider>
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