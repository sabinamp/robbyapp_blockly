let workspacePlayground = Blockly.inject('blocklyDiv', {
  toolbox: document.getElementById('toolbox'),
  media: './blockly-master/media/',
  comments: true,
  scrollbars: false,
  toolboxPosition: 'start',
  horizontalLayout: true,
  readOnly: false,
  zoom:
  {
    controls: true,
    wheel: false,
    startScale: 0.9,
    maxScale: 3,
    minScale: 0.4,
    scaleSpeed: 1.1
  },
  grid:
  {
    spacing: 20,
    length: 1,
    colour: '#CD37B2',
    snap: true
  },
  trashcan: true,
  maxTrashcanContents: 0
});

function myUpdateFunction(event) {
  let code = Blockly.JavaScript.workspaceToCode(workspacePlayground);
  console.log(code);
}

function loadWorkspace(block_xml) {
  let workspace = Blockly.getMainWorkspace();
  workspace.clear();

  if (block_xml) {
    let textToDom = Blockly.Xml.textToDom(block_xml);
    Blockly.Xml.domToWorkspace(textToDom, workspace);
  }

}

function sendGeneratedCodetoRN() {
  let res_code = Blockly.JavaScript.workspaceToCode(workspacePlayground);
  console.log(res_code);
  window.ReactNativeWebView.postMessage(res_code);

}

workspacePlayground.addChangeListener(myUpdateFunction);

// send workspace xml
function sendWorkspacetoRN() {
  let xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
  let domToPretty = Blockly.Xml.domToPrettyText(xml);
  console.log(domToPretty);
  window.ReactNativeWebView.postMessage(domToPretty);
}