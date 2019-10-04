import Realm from 'realm';
import {ProgramModel, Speeds} from '../model/DatabaseModels';
import {Program, Block, InstructionSCHEMA_VERSION, migration} from './RobbyDatabaseSchema';
import {updateRightSpeed} from '../stores/SpeedsStore';


let repository = new Realm({
    path: 'robbyRealm.realm',
    schema: [Program, Tuple],
    schemaVersion: SCHEMA_VERSION,
    migration: migration,
});

function isNotCircular(root, parent, child) {
    if (child.blocks === []) {
        return true;
    } else if (child.blocks.includes(root.id)) {
        return false;
    } else {
        return child.blocks.reduce((acc, b) => {
            acc && isNotCircular(root, child, b);
        });
    }
}

function isUsed(programToRemove, program) {
    if (program.blocks.includes(programToRemove.id)) {
        return true;
    }
}


let RobbyDatabaseAction = {
    add: function (program) {
        repository.write(() => {
            repository.create('Program', program);
        });
    },
    findAllNotCircular: function (program) {
        return repository.objects('Program').filter(p => {
            isNotCircular(program, program, p);
        });
    },
    findAll: function () {
        return repository.objects('Program');
    },
    findOne: function (name) {
        return repository.objectForPrimaryKey('Program', name);
    },
    save: function (program) {
        try {
            repository.write(() => {
                repository.create('Program', program);
                // a.elements.push(new Tuple(1, 2));
            });
            return true;
        } catch (e) {
            return false;
        }
    },
    duplicate: function (program, newName = '') {
        if (newName === '') {
            let i = 1;
            while (RobbyDatabaseAction.findOne(program.name + i) !== undefined) {
                i++;
            }
            program.name = program.name + '(' + i + ')';
            return RobbyDatabaseAction.save(program);
        }
    },
    update: function (program) {
        try {
            repository.write(() => {
                repository.create('Program', program, true);
            });
            return true;
        } catch (e) {
            return false;
        }
    },
    delete: function (program) {
        if (!repository.findAll().reduce((acc, p) => {
            acc && isUsed(program, p); // Frage: Reduce bricht selber ab wenn && ein false verknüpft?
        })) {
            try {
                repository.write(() => {
                    repository.delete(program);
                });
                return true;
            } catch (e) {
                return false;
            }
        }
    },
};

// RobbyDatabaseAction.save(new Program('hallo2'));


module.exports = RobbyDatabaseAction;
