import { DataTypes, Model, Sequelize  } from "sequelize";
import { LeagueoflegendsAccountInterface, UserInterface } from "../interfaces/models.interface";
import { LeagueoflegendsSummoner } from "./leagueoflegends_summoner";
import { User } from "./user.model";

export class LeagueoflegendsAccount extends Model<LeagueoflegendsAccountInterface> implements LeagueoflegendsAccountInterface {
	public id!: number;
	public accountPuuid!: string;
	public accountGamename!: string;
	public accountTagline!: string;
	public leagueoflegendsSummonerId!: number;
	public leagueoflegendsSummoner!: LeagueoflegendsSummoner;
	public user: UserInterface | undefined;
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
	}	

	public static initializeAssossiations() {
		LeagueoflegendsAccount.belongsTo(LeagueoflegendsSummoner, { foreignKey: "leagueoflegendsSummonerId", as: "leagueoflegendsSummoner" });
		LeagueoflegendsAccount.hasOne(User, { foreignKey: "leagueoflegendsAccountId", as: "user" });
	}
}
