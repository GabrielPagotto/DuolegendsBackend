import { DataTypes, Model, Sequelize  } from "sequelize";
import { UserInterface } from "../interfaces/models.interface";
import { LeagueoflegendsAccount } from "./leagueoflegends_account";

export class User extends Model<UserInterface> implements UserInterface {
	public id!: number;
	public email!: string;
	public password!: string;
	public leagueoflegendsVerified!: boolean;
	public leagueoflegendsVerificationCode!: string;
	public leagueoflegendsAccountId: number | undefined;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public static initialize(sequelize: Sequelize) {
		User.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			leagueoflegendsVerified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			leagueoflegendsVerificationCode: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			leagueoflegendsAccountId: {
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
		}, { sequelize, tableName: "users" });
	}

	public static initializeAssossiations() {
		User.belongsTo(LeagueoflegendsAccount, { foreignKey: "leagueoflegendsAccountId", as: "leagueoflegendsAccount" });
	}
}
