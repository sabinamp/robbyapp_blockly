import Realm from 'realm';

// Update Schmea_Version when you do any changes to the schema
let SCHEMA_VERSION = 1;

class Tuple extends Realm.Object {
}

Tuple.schema = {
    name: 'Tuple',
    properties: {
        right: 'int',
        left: 'int',
    },
};

class Program extends Realm.Object {
}

Program.schema = {
    name: 'Program',
    primaryKey: 'name',
    properties: {
        name: 'string',
        elements: 'Tuple[]',
    },
};

module.exports = {Program, Tuple, SCHEMA_VERSION};
