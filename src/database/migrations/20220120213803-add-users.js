'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING(40),
				allowNull: false,
				unique: true,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			leagueoflegends_account_id: {
				type: Sequelize.INTEGER,
				references: {
					model: { tableName: 'leagueoflegends_accounts' },
					key: 'id',
				},
			},
			leagueoflegends_verified: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			leagueoflegends_verification_code: {
				type: Sequelize.STRING,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
    	},
	);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};