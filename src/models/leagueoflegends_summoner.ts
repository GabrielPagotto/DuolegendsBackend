import { DataTypes, Model, Sequelize  } from "sequelize";

export interface LeagueoflegendsSumonnerAttribute {
	id: number | undefined,
	summonerId: string,
	summonerAccountid: string,
	summonerPuuid: string,
	summonerName: string,
    summonerProfileiconid: number,
    summonerRevisiondate: number,
    summonerSummonerlevel: number,
	createdAt: Date | undefined,
	updatedAt: Date | undefined,
}


export class LeagueoflegendsSummoner extends Model<LeagueoflegendsSumonnerAttribute> implements LeagueoflegendsSumonnerAttribute {
	public id!: number;
	public summonerId!: string;
	public summonerAccountid!: string;
	public summonerPuuid!: string;
	public summonerName!: string;
    public summonerProfileiconid!: number;
    public summonerRevisiondate!: number;
    public summonerSummonerlevel!: number;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

    public static initialize(sequelize: Sequelize) {
        LeagueoflegendsSummoner.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            summonerId: {
                type: DataTypes.STRING,
            },
            summonerAccountid: {
                type: DataTypes.STRING,
            },
            summonerPuuid: {
                type: DataTypes.STRING,
            },
            summonerName: {
                type: DataTypes.STRING,
            },
            summonerProfileiconid: {
                type: DataTypes.INTEGER,
            },
            summonerRevisiondate: {
                type: DataTypes.INTEGER,
            },
            summonerSummonerlevel: {
                type: DataTypes.INTEGER,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.now,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.now,
            }
        }, { sequelize, tableName: 'leagueoflegends_summoners' });
    }
}
