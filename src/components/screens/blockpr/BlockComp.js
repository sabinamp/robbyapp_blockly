import React, { Component } from 'react'
import BlocklyWebview from './BlocklyWebview';


let _isMounted = false;


export default class BlockComp extends React.Component {
  /*   static propTypes = {
      block_name: React.PropTypes.string.isRequired,
      block_steps: React.PropTypes.array.isRequired,
      block_xml: React.PropTypes.string.isRequired,
      updateSpeedsInStore: React.PropTypes.function.isRequired
    }; */
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      block_steps: [{ left: 0, right: 0 }],
      block_name: '',
      block_xml: '',
      webviewref: null
    }
    this.receiveCodeAsString = this.receiveCodeAsString.bind(this);
    this.handleBlockCodeReceived = this.handleBlockCodeReceived.bind(this);

  }

  componentDidMount() {
    _isMounted = true;

    this.setState({
      block_steps: this.props.block_steps,
      block_name: this.props.block_name,
      block_xml: this.props.block_xml
    });

  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  receiveCodeAsString(str) {
    console.log("data received from the embedded Blockly web app");
    if (str.slice(0, 4).includes('<xml')) {
      this.handleBlockXMLReceived(str);

    } else {
      this.handleBlockCodeReceived(str);
    }
  }


  handleBlockCodeReceived(str) {
    let qsteps = [];
    const addStep = (step) => qsteps.push(step);
    try {
      //let queue = (new Function('return ' + this.state.block_code))();    
      eval(str);
      console.log(qsteps);
    } catch (e) {
      console.error(e);
    }
    if (Array.isArray(qsteps) && qsteps.length > 1) {
      if (_isMounted) {
        this.setState({ block_steps: qsteps });
        this.setState({ block_xml: '' });
        console.log("blockComp state update called");
      } else {
        console.log("BlockComp unmounted.Can't update block_steps");
      }

      { this.props.updateCurrentSpeeds(qsteps) };
      console.log("speeds to be uploaded-updated");
    }
  }


  handleBlockXMLReceived(workspace) {
    console.log("handleBlockXMLReceived called");
    if (_isMounted) {
      this.setState({ block_xml: workspace });
      console.log("BlockComp state block_xml updated.");
      let currentBlock = Object.assign({}, {
        block_steps: this.state.block_steps,
        block_xml: workspace
      });
      // add new block to Reduxstore    
      this.addNewBlock_fromCurrentState(currentBlock);
    } else { console.log("BlockComp unmounted.Can't update block_xml."); }

  }

  addNewBlock_fromCurrentState(currentBlock) {
    if (currentBlock.block_xml.length > 25
      && currentBlock.block_steps.length > 1) {
      { this.props.addBlockToStore(currentBlock) };
    } else {
      console.log("addBlockToStore -not called.");
    }

  }


  render() {
    return (
      <BlocklyWebview ref={r => (this.webviewref = r)}
        receiveCodeAsString={this.receiveCodeAsString} block_xml={this.state.block_xml} />
    );

  }

}



