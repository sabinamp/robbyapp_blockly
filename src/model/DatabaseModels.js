import uuidv4 from 'uuid/v4';

export class ProgramModel {
    constructor(name, primitive, steps = [], blocks = [], id = uuidv4(), date = new Date(Date.now())) {
        this.id = id;
        this.name = name;
        this.primitive = primitive;
        this.date = date;
        if (steps instanceof Array) {
            this.steps = steps;
        } else {
            let temp_step = [];
            Object.keys(steps).forEach(key => temp_step.push(InstructionModel.fromDatabase(steps[key])));
            this.steps = temp_step;
        }
        if (blocks instanceof Array) {
            this.blocks = blocks;
        } else {
            let temp_block = [];
            Object.keys(blocks).forEach(key => temp_block.push(BlockModel.fromDatabase(blocks[key])));
            this.blocks = temp_block;
        }

    }

    static fromDatabase(program) {
        return new ProgramModel(program.name, program.primitive, program.steps, program.blocks, program.id, program.date);
    }
}

export class InstructionModel {
    constructor(right, left) {
        this.right = right;
        this.left = left;
    }

    static fromDatabase(instruction) {
        return new InstructionModel(instruction.right, instruction.left);
    }

}

export class BlockModel {
    constructor(ref, rep) {
        this.ref = ref;
        this.rep = rep;
    }

    static fromDatabase(block) {
        return new BlockModel(block.ref, block.rep);
    }
}

