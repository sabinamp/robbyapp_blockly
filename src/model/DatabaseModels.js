export class ProgramModel {
    constructor(name, id, date = Date.now(), primitive, steps = [], blocks = []) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.primitive = primitive;
        this.steps = steps;
        this.blocks = blocks;
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
