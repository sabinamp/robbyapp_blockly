Blockly.Blocks['b2'] = {
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
    this.setColour(135);
    this.setTooltip("Move ");
    this.setHelpUrl("");
  }

};