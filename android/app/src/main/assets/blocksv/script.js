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
    minScale: 0.35,
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
});

function myUpdateFunction(event) {

  let code = Blockly.JavaScript.workspaceToCode(workspacePlayground);
  console.log(code);
}

function sendGeneratedCode() {
  let res_code = Blockly.JavaScript.workspaceToCode(workspacePlayground);
  console.log(res_code);
  /*  let steps = [{ left: 0, right: 0 }];
   const addStep = (step) => steps.push(step); */
  /*  try {
     eval(res_code);    
     console.log(steps);
   } catch (e) {
     console.error(e);
   } */
  window.ReactNativeWebView.postMessage(res_code);
}

workspacePlayground.addChangeListener(myUpdateFunction);
document.getElementById('done').addEventListener('click', sendGeneratedCode);

// save workspace
function saveWorkspace() {
  let xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
  let domToPretty = Blockly.Xml.domToPrettyText(xml);
  window.localStorage.setItem("myBlock1", domToPretty);
  console.log(domToPretty);
}

// restore workspace
function restoreWorkspace() {

  let program = window.localStorage.getItem("myBlock1");
  Blockly.mainWorkspace.clear();

  let textToDom = Blockly.Xml.textToDom(program);
  Blockly.Xml.domToWorkspace(textToDom, Blockly.mainWorkspace);

}

// delete workspace
function deleteWorkspace() {
  window.localStorage.clear();
}


console.log(Blockly.JavaScript)