import RobbyDatabaseAction from '../database/RobbyDatabaseActions';
import {Block, Program} from '../model/DatabaseModels';
import uuidv4 from 'uuid/v4';

export class DatabaseTest {

    basename = 'Model';
    amount = 10;

    clearDatabase() {
        let l = RobbyDatabaseAction.findAll().length;
        console.log('clearing database, amount of entries: ' + l);
        RobbyDatabaseAction.findAll().forEach(elem => {
            RobbyDatabaseAction.delete(elem.id, true);
        });
        l = RobbyDatabaseAction.findAll().length;
        console.log('Database has this amount of entries: ' + l);
        console.assert(l === 0, {length: l, errorMsg: 'Database is not empty'}.toString());
    }

    createDatabaseEntries() {
        console.log('creating entries');
        let amountOfExisitingEntries = RobbyDatabaseAction.findAll().length;
        for (var i = 1; i < this.amount; i++) {
            RobbyDatabaseAction.add(new Program(this.basename + i, false, [], []));
        }
        let l = RobbyDatabaseAction.findAll().length;
        console.log('Database has this amount of entries: ' + l);
        console.assert(l === this.amount + this.amountOfExisitingEntries, {
            length: l,
            errorMsg: 'error or some entries have already existed',
        }.toString());
    }

    creatingDatabaseEntriesWithDependencies() {
        console.log('creating entries');
        let amountOfExisitingEntries = RobbyDatabaseAction.findAll().length;
        let firstProgram = new Program('Model64', false);
        RobbyDatabaseAction.add(firstProgram);
        let amount = 10;
        let i;
        for (i = 0; i < this.amount; i++) {
            RobbyDatabaseAction.add(new Program(this.basename + i, false, [], [new Block(firstProgram.id, 1)]));
        }
        let l = RobbyDatabaseAction.findAll().length;
        console.log('Database has this amount of entries: ' + l);
        let a = RobbyDatabaseAction.delete(firstProgram.id);
        console.log(a);
    }

    updatingEntries() {
        this.createDatabaseEntries();
        RobbyDatabaseAction.findAll().forEach(elem => {
            elem.name = elem.name + 'updated';
            elem.blocks.push(new Block(elem.id, 1));
            RobbyDatabaseAction.save(elem);
        });
        console.log(RobbyDatabaseAction.findAll());

    }

    findOne() {
        this.createDatabaseEntries();
        let a = RobbyDatabaseAction.findOne(this.basename + '1');
        console.log(a);
        // findOneconsole.log(a.length === 0);
    }

    duplicate() {
        let f = new Program(this.basename, false, [], [new Block(uuidv4(), 3)]);
        RobbyDatabaseAction.add(f);
        let i;
        for (i = 0; i < this.amount; i++) {
            RobbyDatabaseAction.duplicate(f);
        }
        console.log(RobbyDatabaseAction.findAll());
    }

    recurive() {
        this.creatingDatabaseEntriesWithDependencies();
        let a = RobbyDatabaseAction.findOne(this.basename + 64);
        RobbyDatabaseAction.add(new Program('you can use me', true));
        console.log('Ready');
        console.log(a);
        console.log(RobbyDatabaseAction.findAllNotCircular(a));
    }

    findOneByPK() {
        this.creatingDatabaseEntriesWithDependencies();

        let pk = RobbyDatabaseAction.findAll()[0].id;
        console.log(pk);
        console.log(RobbyDatabaseAction.findOneByPK(pk));
    }
}
