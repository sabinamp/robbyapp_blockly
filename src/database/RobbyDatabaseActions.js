import Realm from 'realm';
import {ProgramModel} from '../model/DatabaseModels';
import {Program, SCHEMA_VERSION, Tuple} from './RobbyDatabaseSchema';


let repository = new Realm({
    path: 'robbyRealm.realm', schema: [Program, Tuple], schemaVersion: SCHEMA_VERSION,
});


let RobbyDatabaseAction = {
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
        try {
            repository.write(() => {
                repository.delete(program);
            });
            return true;
        } catch (e) {
            return false;
        }
    },
};

RobbyDatabaseAction.save(new ProgramModel('sdafsdaf'));

module.exports = RobbyDatabaseAction;
