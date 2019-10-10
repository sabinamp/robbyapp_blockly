import RobbyDatabaseAction from '../database/RobbyDatabaseActions';
import {BlockModel, ProgramModel} from '../model/DatabaseModels';
import uuidv4 from 'uuid/v4';

export class DatabaseTest {


    clearDatabase() {
        // console.log(RobbyDatabaseAction.findAll());
        let l = RobbyDatabaseAction.findAll().length;
        console.log('clearing database, amount of entries: ' + l);
        RobbyDatabaseAction.findAll().forEach(elem => {
            RobbyDatabaseAction.delete(elem.id);
        });
        l = RobbyDatabaseAction.findAll().length;
        console.log('Database has this amount of entries: ' + l);
        console.assert(l === 0, {length: l, errorMsg: 'Database is not empty'}.toString());
    }

    createDatabaseEntries() {
        console.log('creating entries');
        let amountOfExisitingEntries = RobbyDatabaseAction.findAll().length;
        let amount = 10;
        var i;
        for (i = 1; i < amount; i++) {
            console.log(i);
            console.log(RobbyDatabaseAction.add(new ProgramModel('Model' + i, false)));
        }
        let l = RobbyDatabaseAction.findAll().length;
        console.log('Database has this amount of entries: ' + l);
        console.assert(l === amount + amountOfExisitingEntries, {
            length: l,
            errorMsg: 'Database is not empty',
        }.toString());
    }

    creatingDatabaseEntriesWithDependencies() {
        console.log('creating entries');
        let amountOfExisitingEntries = RobbyDatabaseAction.findAll().length;
        let firstProgram = new ProgramModel('Model64', false);
        RobbyDatabaseAction.add(firstProgram);
        let amount = 10;
        var i;
        for (i = 0; i < amount; i++) {
            RobbyDatabaseAction.add(new ProgramModel('Model' + i, false, [], [new BlockModel(firstProgram.id, 1)]));
        }
        let l = RobbyDatabaseAction.findAll().length;
        console.log('Database has this amount of entries: ' + l);
        let a = RobbyDatabaseAction.delete(firstProgram.id);
        console.log(a);
    }
}
