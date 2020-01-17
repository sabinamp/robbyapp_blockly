import React, { Component } from 'react'
import BlocklyWebview from './BlocklyWebview';
import { add, removeAll, updateAll } from '../../../stores/SpeedsStore';

export default class BlockComp extends React.Component {
  constructor() {
    super()
    this.state = {
      steps_as_string: '',
      block_name: '',
      workspace_xml: '',
    }
    this.receiveStringData = this.receiveStringData.bind(this);
    this.updateBlock = this.updateBlock.bind(this);

  }
  /*   static propTypes = {
      block_name: React.PropTypes.string.isRequired,
      data_as_string: React.PropTypes.string.isRequired,
      steps: React.PropTypes.array,
      color: React.PropTypes.color,
      
    };
  
  
    state = {
      data_as_string: this.props.received_string,
      block_name: this.props.block_name,
      steps: this.props.steps,
      color: this.props.color,
    
    } */

  shouldComponentUpdate() {
    //to do
    //if block name didn't change,no update
    return true;

  }

  setBlockName(name) {
    this.setState({ block_name: name });
  }

  addStepLeftSpeed(index, text) {
    updateLeftSpeed(index, parseInt(text));
  }
  addStepRightSpeed(index, text) {
    updateRightSpeed(index, parseInt(text));
  }
  addOneStep(textL, textR) {
    add({ left: parseInt(text), right: parseInt(text) });
  }
  updateBlock() {
    //result should be a string containing an array such as: "Array [ Object { left: 13, right: 14 }, Object { left: 12, right: 13 }, Object { left: 13, right: 14 }, Object { left: 12, right: 13 }]"
    /*     let words2 = received_string;
        let result2 = words2.substring(6, words2.length);
        let result3 = result2.split('Object');
        result3 = result3.splice(1);
        result3.forEach(elem => {
          elem.trim();
          console.log("left speed" + elem.substring(9, 11));
          console.log("right speed: " + elem.substring(20, 22));
          this.addOneStep(elem.substring(9, 11), elem.substring(20, 22))
        }); */
    let qsteps = [{ left: 0, right: 0 }];
    const addStep = (step) => qsteps.push(step);
    const setBlockNameAndColor = (n, c) => this.setBlockNameColor(n, c);
    try {

      //let queue = (new Function('return ' + this.state.steps_as_string))();
      eval(this.state.steps_as_string);
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
  }

  receiveStringData(str) {
    this.setState({ steps_as_string: str });
    console.log("data received from the embedded web app");
    this.updateBlock();
    console.log("block updated" + this.state);
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
        receiveStringData={this.receiveStringData} />

    );
  }

}



