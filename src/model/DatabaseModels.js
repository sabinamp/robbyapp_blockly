import uuidv4 from 'uuid/v4';

export class ProgramModel {
    constructor(name, primitive, id = uuidv4(), date = Date.now(), steps = [], blocks = []) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.primitive = primitive;
        this.steps = steps;
        this.blocks = blocks;
    }

    static fromDatabase(program) {
        return new ProgramModel(program.name, program.primitive, program.id, program.date, program.steps, program.blocks);
    }
}

export class InstructionModel {
    constructor(right, left) {
        this.right = right;
        this.left = left;
    }

}

export class BlockModel {
    constructor(ref, rep) {
        this.ref = ref;
        this.rep = rep;
    }
}

