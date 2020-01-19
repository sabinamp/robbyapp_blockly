import React, { Component } from 'react'
import BlocklyWebview from './BlocklyWebview';
import BlocklyWebview2 from './BlocklyWebview2';

let isMounted = false;

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


  handleBlockCodeReceived(str) {

    let qsteps = [{ left: 0, right: 0 }];
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
        Object.assign(this.state.block_steps, qsteps);
        console.log("blockComp state updated.code_steps :" + this.state.block_steps);
      } else { console.log("BlockComp unmounted.Can't update block_steps"); }

      { this.props.updateSpeedsInStore(qsteps) };
      console.log("speeds in the store-updated");
    }
  }

  receiveCodeAsString(str) {

    console.log("data received from the embedded Blockly web app");
    if (str.slice(0, 4).includes('<xml')) {
      this.handleBlockXMLReceived(str);

    } else {
      this.handleBlockCodeReceived(str);
    }
    // save block;
    { this.props.saveBlock(this.state); }
    /*  if (this.props.sendEvent) { this.props.cancelSendEventToBlockly } ;
    console.log("comp data should have been updated. sendEvent canceled");*/
  }


  handleBlockXMLReceived(workspace) {
    if (_isMounted) {
      this.setState({ block_xml: workspace });
      console.log("BlockComp state block_xml updated.");
    } else { console.log("BlockComp unmounted.Can't update block_xml."); }

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
      <BlocklyWebview ref={r => (this.webviewref = r)}
        receiveCodeAsString={this.receiveCodeAsString} block_xml={this.state.block_xml} />
    );

  }

}



