import React, { Component } from 'react'
import BlocklyWebview from './BlocklyWebview';
import { add, removeAll, addSpeedChangeListener } from '../../../stores/SpeedsStore';

export default class BlockComp extends React.Component {
  constructor() {
    super()
    this.state = {
      steps_as_string: '',
      block_name: '',
      color: '#000000',
      speeds: [],
    }
    this.receiveStringData = this.receiveStringData.bind(this);
    this.updateBlock = this.updateBlock.bind(this);

    addSpeedChangeListener((speeds) => {
      this.setState({ speeds: speeds });
    });
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



  setBlockName(name) {
    this.setState({ block_name: name });
  }
  setColor(color) {
    this.setState({ color: color })
  }

  setBlockNameColor(name, colorstring) {
    //the color from Blockly web app has the format _33ccff
    colorval = "#" + colorstring.substring(1, colorstring.length);
    setColor(colorv);
    setBlockName(name);
    console.log("name and color: " + this.state);
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

  render() {
    return (
      <BlocklyWebview
        receiveStringData={this.receiveStringData} />

    );
  }

}



