'use strict';

module.exports = {
  	up: async (queryInterface, Sequelize) => {
     	await queryInterface.createTable('leagueoflegends_accounts', {
      		id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			account_puuid: {
				type: Sequelize.STRING,
				unique: true,
			},
			account_gamename: {
				type: Sequelize.STRING,
				unique: true,
			},
			account_tagline: {
				type: Sequelize.STRING,
			},
			leagueoflegends_summoner_id: {
				type: Sequelize.INTEGER,
				references: {
					model: { tableName: 'leagueoflegends_summoners' },
					key: 'id',
				},
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
    	});
 	},

  	down: async (queryInterface, Sequelize) => {
     	await queryInterface.dropTable('leagueoflegends_accounts');
  	}
};
