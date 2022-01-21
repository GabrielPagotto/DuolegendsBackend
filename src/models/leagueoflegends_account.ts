import { DataTypes, Model, Sequelize  } from "sequelize";
import { LeagueoflegendsSummoner } from "./leagueoflegends_summoner";

export interface LeagueoflegendsAccountAttribute {
	id: number | undefined,
	accountPuuid: string,
	accountGamename: string,
	accountTagline: string,
	leagueoflegendsSummonerId: number,
	createdAt: Date | undefined,
	updatedAt: Date | undefined,
}


export class LeagueoflegendsAccount extends Model<LeagueoflegendsAccountAttribute> implements LeagueoflegendsAccountAttribute {
	public id!: number;
	public accountPuuid!: string;
	public accountGamename!: string;
	public accountTagline!: string;
	public leagueoflegendsSummonerId!: number;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	static initialize(sequelize: Sequelize) {
		LeagueoflegendsAccount.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			accountPuuid: {
				type: DataTypes.STRING,
			},
			accountGamename: {
				type: DataTypes.STRING,
			},
			accountTagline: {
				type: DataTypes.STRING,
			},
			leagueoflegendsSummonerId: {
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
		}, { sequelize, tableName: "leagueoflegends_accounts" });

		LeagueoflegendsAccount.belongsTo(LeagueoflegendsSummoner, { foreignKey: "leagueoflegendsSummonerId", as: "leagueoflegendsSummoner" });
	}	
}
