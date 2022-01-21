import { DataTypes, Model, Sequelize  } from "sequelize";
import { LeagueoflegendsAccount } from "./leagueoflegends_account";


export interface UserAttribute {
	id: number,
	email: string,
	password: string,
	verified: boolean,
	verificationCode: string,
	leagueoflegendsAccountId: number,
	createdAt: Date,
	updatedAt: Date,
}

export class User extends Model<UserAttribute> implements UserAttribute {
	public id!: number;
	public email!: string;
	public password!: string;
	public verified!: boolean;
	public verificationCode!: string;
	public leagueoflegendsAccountId!: number;
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
			verified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			verificationCode: {
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

		User.belongsTo(LeagueoflegendsAccount, { foreignKey: "leagueoflegendsAccountId", as: "leagueoflegendsAccount" });
	}
}
