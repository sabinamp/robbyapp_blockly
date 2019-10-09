import Realm from 'realm';
import {ProgramModel, Speeds} from '../model/DatabaseModels';
import {Program, Instruction, Block, SCHEMA_VERSION, migration} from './RobbyDatabaseSchema';
import {updateRightSpeed} from '../stores/SpeedsStore';


let repository = new Realm({
    path: 'robbyRealm.realm',
    schema: [Program, Instruction, Block],
    schemaVersion: SCHEMA_VERSION,
    migration: migration,
});


/*
root_id : id of route element
child : element which may contains root as a child
return : true if no child contains root element as child
 */
function isNotCircular(root_id, child): boolean {
    if (child.blocks.includes(root_id)) {
        return false;
    } else {
        return child.blocks.reduce((acc, b) => acc && isNotCircular(root_id, b, true));
    }
}

function isUsed(programToRemove, program): boolean {
    return program.blocks.includes(programToRemove.id);
}


let RobbyDatabaseAction = {
    add: function (program): boolean {
        try {
            repository.write(() => {
                repository.create('Program', program);
            });
            return true;
        } catch (e) {
            return false;
        }
    },
    findAllNotCircular: function (program): Program[] {
        return repository.objects('Program').filter(p => {
            isNotCircular(program.id, p);
        });
    },
    findAll: function (): Program[] {
        return repository.objects('Program');
    },
    findOne: function (name): Program {
        return repository.objects('Program').filtered('name = $0', name);
    },
    save: function (program): boolean {
        try {
            repository.write(() => {
                repository.create('Program', program);
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
    update: function (program): boolean {
        try {
            repository.write(() => {
                repository.create('Program', program, true);
            });
            return true;
        } catch (e) {
            return false;
        }
    },
    delete: function (program): boolean {
        if (!repository.findAll().reduce((acc, p) => {
            acc && isUsed(program, p);
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
        return false;
    },
};

// RobbyDatabaseAction.save(new Program('hallo2'));


module.exports = RobbyDatabaseAction;
