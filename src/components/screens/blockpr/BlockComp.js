import React, { Component } from 'react'
import BlocklyWebview from './BlocklyWebview';
import { add, addSpeedChangeListener } from '../../../stores/SpeedsStore';

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

  receiveStringData(str) {
    this.setState({ steps_as_string: str });
    updateBlock();
  }

  setBlockName(name) {
    this.setState({ block_name: name });
  }
  setColor(color) {
    this.setState({ color: color })
  }
  setBlockNameAndColor(name, colorstring) {
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
  updateBlock = () => {

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

    try {
      let qsteps = [{ left: 0, right: 0 }];
      const addStep = (step) => qsteps.push(step);
      let queue = (new Function('return ' + this.state.steps_as_string))();

      if (Array.isArray(qsteps)) {
        console.log(qsteps);
        queue.forEach(element => {
          add(element);
        });
      }
    } catch (e) {
      console.error(e);
    }

  }
  return() {
    this.render(
      <BlocklyWebview
        receiveStringData={() => this.receiveStringData} />

    );
  }

}



