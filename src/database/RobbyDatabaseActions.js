import Realm from 'realm';
import {ProgramModel, Speeds} from '../model/DatabaseModels';
import {Program, Instruction, Block, SCHEMA_VERSION, migration} from './RobbyDatabaseSchema';
import {updateRightSpeed} from '../stores/SpeedsStore';
import uuidv4 from 'uuid/v4';

let repository = new Realm({
    path: 'robbyRealm.realm',
    schema: [Program, Instruction, Block],
    schemaVersion: SCHEMA_VERSION,
    migration: migration,
});


// Checks whether the given `program` has a direct reference to the program with the id `program_id`.
// This function is used to test whether the program `program_id` can be deleted.
function isUsed(program, program_id): boolean {
    console.log('comparing: ' + program_id + ' and ' + program.blocks.map(block => block.ref) + 'resutl : ' + program.blocks.map(block => block.ref).includes(program_id));
    return program.blocks.map(block => block.ref).includes(program_id);
}

// Checks whether the given `program` has an indirect reference to the program with the id `program_id`.
function isUsedRecursive(program, program_id): boolean {

    return isUsed(program, program_id) || program.blocks.reduce((acc, p) => acc || isUsedRecursive(p, program_id), false);
}

function nameIsUnused(name) {
    return Object.keys(RobbyDatabaseAction.findOne(name)).length === 0;
}

let RobbyDatabaseAction = {
    add: function (program): String {
        if (nameIsUnused(program.name)) {
            try {
                repository.write(() => {
                    repository.create('Program', program);
                });
                return 'Saved to Database';
            } catch (e) {
                return 'Error while saving: ' + e;
            }
        }
        return 'Name is already taken';
    },
    // returns all programs which can be added to the given program `program` without building a cycle
    findAllNotCircular: function (program): ProgramModel[] {
        return repository.objects('Program').filter(p => !isUsedRecursive(p, program.id)).map(elem => ProgramModel.fromDatabase(elem));
    },
    findAll: function (): ProgramModel[] {
        return repository.objects('Program').map(elem => ProgramModel.fromDatabase(elem));
    },
    findOne: function (name): ProgramModel {
        return repository.objects('Program').filtered('name = $0 LIMIT(1)', name);
    },
    duplicate: function (program, newName = '') {
        let i = 1;
        program.name = newName;
        program.id = uuidv4();
        while (!nameIsUnused(program.name)) {
            i++;
            program.name = program.name + '(' + i + ')';
        }
        return RobbyDatabaseAction.save(program);

    },
    save: function (program): boolean {
        try {
            repository.write(() => {
                repository.create('Program', program, true);
            });
            return true;
        } catch (e) {
            return false;
        }
    },
    delete: function (program_id): String {
        console.log(!RobbyDatabaseAction.findAll().reduce((acc, p) => acc && isUsed(p, program_id), false));
        if (!RobbyDatabaseAction.findAll().reduce((acc, p) => acc || isUsed(p, program_id), false)) {
            try {
                repository.write(() => {
                    repository.delete(repository.objectForPrimaryKey('Program', program_id));
                });
                return 'Deleted Object: ' + program_id;
            } catch (e) {
                return e;
            }
        }
        return 'Program is used by other program';
    },
    force_delete: function (program_id): String {
        try {
            repository.write(() => {
                repository.delete(repository.objectForPrimaryKey('Program', program_id));
            });
            return 'Deleted Object: ' + program_id;
        } catch (e) {
            return e;
        }
    },

};


module.exports = RobbyDatabaseAction;
