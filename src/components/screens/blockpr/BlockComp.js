import React, { Component } from 'react'
import BlocklyWebview from './BlocklyWebview';
import { add, removeAll, updateAll } from '../../../stores/SpeedsStore';

export default class BlockComp extends React.Component {
  constructor() {
    super()
    this.state = {
      block_code: '',
      block_name: '',
      block_xml: '',
    }
    this.receiveCodeAsString = this.receiveCodeAsString.bind(this);
    this.handleBlockCodeReceived = this.handleBlockCodeReceived.bind(this);

  }
  /*   static propTypes = {
      block_name: React.PropTypes.string.isRequired,
      block_code: React.PropTypes.string.isRequired,
      block_xml: React.PropTypes.string.isRequired,
      color: React.PropTypes.color,
      
    };
  
  
    state = {
      block_code: this.props.block_code,
      block_name: this.props.block_name,
      block_xml: this.props.block_xml,
      color: this.props.color,
    
    } */

  shouldComponentUpdate() {
    //to do
    //if block name didn't change,no update   
    return true;

  }


  /*   addStepLeftSpeed(index, text) {
      updateLeftSpeed(index, parseInt(text));
    }
    addStepRightSpeed(index, text) {
      updateRightSpeed(index, parseInt(text));
    }
    addOneStep(textL, textR) {
      add({ left: parseInt(text), right: parseInt(text) });
    } */

  handleBlockCodeReceived(str) {
    this.setState({ block_code: str });
    let qsteps = [{ left: 0, right: 0 }];
    const addStep = (step) => qsteps.push(step);
    try {
      //let queue = (new Function('return ' + this.state.block_code))();    
      eval(this.state.block_code);
      console.log(qsteps);
    } catch (e) {
      console.error(e);
    }
    if (Array.isArray(qsteps) && qsteps.length > 0) {
      removeAll();
      /*let tosend = [{ left: 0, right: 0 }];
        let chunklength = 50;
       while (qsteps.length > chunklength) {
         tosend = this.chunk(qsteps, chunklength);
         //updateAll(tosend); 
         qsteps.slice(chunklength);
       } */

      qsteps.forEach(element => {
        add(element);
        console.log("step:" + element);
      });

    }
    console.log("speeds in the store-updated");
  }

  receiveCodeAsString(str) {
    console.log("data received from the embedded Blockly web app");
    if (str.slice(0, 4).includes('<xml')) {
      this.handleBlockXMLReceived(str);

    } else {
      this.handleBlockCodeReceived(str);
    }
  }
  handleBlockXMLReceived(workspace) {
    this.setState({ block_xml: workspace });
    //save;
    console.log("handleBlockXMLReceived called");
  }


  chunk(array, size) {
    const chunked_arr = [];
    let copied = [...array]; // ES6 destructuring
    const numOfChild = Math.ceil(copied.length / size); // Round up to the nearest integer
    for (let i = 0; i < numOfChild; i++) {
      chunked_arr.push(copied.splice(0, size));
    }
    return chunked_arr;
  }

  render() {
    return (
      <BlocklyWebview
        receiveCodeAsString={this.receiveCodeAsString} />

    );
  }

}



