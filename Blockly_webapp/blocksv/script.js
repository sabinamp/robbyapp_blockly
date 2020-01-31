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
//speeds related text
const Blockly_Msg_SETSPEEDS_TOOLTIP = "Set the wheel speeds";
const Blockly_Msg_SETSPEEDS_LEFT = " left";
const Blockly_Msg_SETSPEEDS_RIGHT = "right";
const Blockly_Msg_SETSPEEDS_MAXVALUE_WARNING = '100 is the maximum allowed speed.';
//Loop blocks related text
const Blockly_Msg_LOOP = "Loop";
const Blockly_Msg_LOOP_TOOLTIP = "Repeat";
//set speeds
Blockly.Blocks['set_speeds'] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(new Blockly.FieldLabelSerializable(Blockly_Msg_SETSPEEDS_LEFT), "leftSpeed");
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0, 0, 100), "leftWheelSpeed");
    this.appendDummyInput()
      .appendField(new Blockly.FieldLabelSerializable(Blockly_Msg_SETSPEEDS_RIGHT), "rightSpeed");
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0, 0, 100), "rightWheelSpeed");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip(Blockly_Msg_SETSPEEDS_TOOLTIP);
    this.setHelpUrl("");
  },
  onchange: function () {
    if ((this.getFieldValue('leftWheelSpeed') > '100') || (this.getFieldValue('rightWheelSpeed') > '100')) {
      this.setWarningText(Blockly_Msg_SETSPEEDS_MAXVALUE_WARNING);
    } else {
      this.setWarningText(null);
    }

  }
};

Blockly.JavaScript['set_speeds'] = function (block) {
  var number_leftspeed = block.getFieldValue('leftWheelSpeed');
  var number_rightspeed = block.getFieldValue('rightWheelSpeed');

  let code = 'addStep({left:' + number_leftspeed + ', right:' + number_rightspeed + '});\n';
  return code;
};

Blockly.Blocks['repeat'] = {
  init: function () {
    this.appendStatementInput("DO")
      .setCheck(null)
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(new Blockly.FieldLabelSerializable(Blockly_Msg_LOOP), "Loop")
      .appendField(new Blockly.FieldNumber(0, 2, 90), "i")
      /* .appendField(new Blockly.FieldLabelSerializable("times"), "times") */;

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(125);
    this.setTooltip(Blockly_Msg_LOOP_TOOLTIP);
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['repeat'] = function (block) {

  // Assemble JavaScript into code variable.   
  let statements_repeat = Blockly.JavaScript.statementToCode(block, 'DO');
  // Repeat n times.
  if (block.getField('i')) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue('i')));
  } else {
    // External number.
    var repeats = Blockly.JavaScript.valueToCode(block, 'i',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
  }
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block);
  var code = '';
  let loopVar = 'count';
  var endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    code += 'let ' + endVar + ' = ' + repeats + ';\n';
  }
  code += 'for (let ' + loopVar + ' = 0; ' +
    loopVar + ' < ' + endVar + '; ' +
    loopVar + '++) {\n' +
    branch + '}\n';
  return code;
}

Blockly.Blocks['set_speeds2'] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(new Blockly.FieldLabelSerializable(Blockly_Msg_SETSPEEDS_LEFT), "leftSpeed");
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0, 50, 100), "leftWheelSpeed2");
    this.appendDummyInput()
      .appendField(new Blockly.FieldLabelSerializable(Blockly_Msg_SETSPEEDS_RIGHT), "rightSpeed");
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0, 25, 100), "rightWheelSpeed2");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip(Blockly_Msg_SETSPEEDS_TOOLTIP);
    this.setHelpUrl("");
  },
  onchange: function () {
    if ((this.getFieldValue('leftWheelSpeed2') > '100') || (this.getFieldValue('rightWheelSpeed2') > '100')) {
      this.setWarningText(Blockly_Msg_SETSPEEDS_MAXVALUE_WARNING);
    } else {
      this.setWarningText(null);
    }

  }
};

Blockly.JavaScript['set_speeds2'] = function (block) {
  var number_leftspeed2 = block.getFieldValue('leftWheelSpeed2');
  var number_rightspeed2 = block.getFieldValue('rightWheelSpeed2');

  let code = 'addStep({left:' + number_leftspeed2 + ', right:' + number_rightspeed2 + '});\n';
  return code;
};

const block1 = `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="repeat" x="30" y="50">
  <field name="Loop">Loop</field>
  <field name="i">15</field>
  <statement name="DO">
    <block type="set_speeds2" id="_$a:2lHW0)Nd{qXA4]b0">
      <field name="leftSpeed"> left</field>
      <field name="leftWheelSpeed2">50</field>
      <field name="rightSpeed">right</field>
      <field name="rightWheelSpeed2">25</field>
    </block>
  </statement>
</block>
</xml>`;

function loadWorkspace(block_xml) {
  /* let workspace = Blockly.getMainWorkspace();
  workspace.clear();
  if (block_xml) {
    let textToDom = Blockly.Xml.textToDom(block_xml);
    Blockly.Xml.domToWorkspace(workspace, textToDom);
  } */
  Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.textToDom(block_xml), Blockly.getMainWorkspace())

}
window.onload = loadWorkspace(block1);

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