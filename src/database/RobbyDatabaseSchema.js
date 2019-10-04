import Realm from 'realm';

// Update Schmea_Version when you do any changes to the schema
const SCHEMA_VERSION = 7;


class Instruction extends Realm.Object {
}

Instruction = {
    name: 'Instruction',
    properties: {
        left: 'int',
        right: 'int',
    },
};

class Block extends Realm.Object {
}

Block = {
    name: 'Block',
    properties: {
        ref: 'int', // reference to a program
        rep: {type: 'int', default: 1},
    },
};

class Program extends Realm.Object {
}

Program = {
    name: 'Program', // Frage: Kann man den primayKey ändern?
    primaryKey: 'id',
    // Ein Programm möchte man ja umbenennen können.
    properties: {
        id: 'int',
        name: {type: 'string', indexed: true},
        date: 'date',			// Record-Date
        primitive: 'bool',      // true => NumberSequence, false => BlockSequence
        steps: 'Instruction[]',  	// one of them is empty.
        blocks: 'Block[]',
    },
};


const migration = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < SCHEMA_VERSION) {
        const oldObjects = oldRealm.objects('Program');
        const newObjects = newRealm.objects('Program');
        for (let i = 0; i < oldObjects.length; i++) {
            // newObjects[i].name = oldObjects[i].name;
            // newObjects[i].elements = [];
            // newObjects[i].programs = [];
        }
    }
};

module.exports = {Program, Block, Instruction, SCHEMA_VERSION, migration};
