Blockly.Blocks['defineblock'] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField(new Blockly.FieldLabelSerializable("block name"), "MyBlock")
      .appendField(new Blockly.FieldColour("#33ccff"), "BlockColor");
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField(new Blockly.FieldTextInput("Block Name"), "BlockName");
    this.setInputsInline(true);
    this.setNextStatement(true, null);
    this.setColour(285);
    this.setTooltip("Define My Block");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['defineblock'] = function (block) {
  var colour_blockcolor = block.getFieldValue('BlockColor');
  var text_blockname = block.getFieldValue('BlockName');
  // Assemble JavaScript into code variable.
  let name = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('BlockName'), Blockly.Variables.NAME_TYPE);
  let color = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('BlockColor'), Blockly.Variables.COLOR_TYPE);
  let code = 'setBlockNameAndColor( ' + name + ',' + color + ');\n';
  return code;
};



/* Blockly.Blocks['insertblock'] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(new Blockly.FieldLabelSerializable("insert"), "useBlock")
      .appendField(new Blockly.FieldDropdown([["myblock1", "blocks/myblock1"], ["myblock2", "blocks/myblock2"]]), "SELECTEDBLOCKNAME");
    this.appendDummyInput()
      .appendField("from saved");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(195);
    this.setTooltip("Insert block");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['insertblock'] = function (block) {
  var dropdown_name = block.getFieldValue('SELECTEDBLOCKNAME');
  // Assemble JavaScript into code variable.
  let blockVar = Blockly.JavaScript.variableDB_.getDistinctName(
    dropdown_name, Blockly.Variables.NAME_TYPE);

  let code = blockVar + '();\n';
  return code;
}; */

//set speeds
Blockly.Blocks['set_speeds'] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(new Blockly.FieldLabelSerializable(" left"), "leftSpeed");
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0, 0, 100), "leftWheelSpeed");
    this.appendDummyInput()
      .appendField(new Blockly.FieldLabelSerializable("right"), "rightSpeed");
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0, 0, 100), "rightWheelSpeed");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip("Move ");
    this.setHelpUrl("");
  },
  onchange: function () {
    if ((this.getFieldValue('leftWheelSpeed') > '100') || (this.getFieldValue('rightWheelSpeed') > '100')) {
      this.setWarningText('100 is the maximum allowed speed.');
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
      .appendField(new Blockly.FieldLabelSerializable("Loop"), "Loop")
      .appendField(new Blockly.FieldNumber(0, 2, 100), "i")
      /* .appendField(new Blockly.FieldLabelSerializable("times"), "times") */;

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(125);
    this.setTooltip("Loop");
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