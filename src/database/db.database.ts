import { Sequelize } from "sequelize";

import { User } from "../models/user.model";
import { LeagueoflegendsAccount } from "../models/leagueoflegends_account";
import { LeagueoflegendsSummoner } from "../models/leagueoflegends_summoner";

const dbConfig = require("../configs/db.config");

export default class Database {
    public connection!: Sequelize;

    constructor() {
        this.init();
    }

    private init(): void {
        if (!dbConfig.dialect) {
            throw new Error("The database dialect was not informed in the environment variables. [DATABASE_DIALECT]");
        }
        
        if (!dbConfig.username) {
            throw new Error("The database username was not informed in the environment variables. [DATABASE_USERNAME]");
        }
        
        if (!dbConfig.password) {
            throw new Error("The database password was not informed in the environment variables. [DATABASE_PASSWORD]");
        }
        
        if (!dbConfig.host) {
            throw new Error("The database host was not informed in the environment variables. [DATABASE_HOST]");
        }
        
        if (!dbConfig.port) {
            throw new Error("The database port was not informed in the environment variables. [DATABASE_PORT]");
        }
        
        if (!dbConfig.database) {
            throw new Error("The database name was not informed in the environment variables. [DATABASE_NAME]");
        }
        
        this.connection = new Sequelize(dbConfig);
        this.connection.authenticate().then(() => {
            console.log("Connection to the database was successful");
        }).catch(err => console.log("Failed to connect to the database"));
        this.initializeModels();
    }

    private initializeModels(): void {
        LeagueoflegendsSummoner.initialize(this.connection);
        LeagueoflegendsAccount.initialize(this.connection);
        User.initialize(this.connection);

        LeagueoflegendsSummoner.initializeAssossiations();
        LeagueoflegendsAccount.initializeAssossiations();
        User.initializeAssossiations();
    }   
}