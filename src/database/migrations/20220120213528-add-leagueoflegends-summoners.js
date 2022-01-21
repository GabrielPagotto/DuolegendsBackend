'use strict';

module.exports = {
  	up: async (queryInterface, Sequelize) => {
     	await queryInterface.createTable('leagueoflegends_summoners', {
      		id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false
			},
			summoner_id: {
				type: Sequelize.STRING,
				unique: true,
			},
			summoner_accountid: {
				type: Sequelize.STRING,
				unique: true,
			},
			summoner_puuid: {
				type: Sequelize.STRING,
			},
			summoner_name: {
				type: Sequelize.STRING,
			},
			summoner_profileiconid: {
				type: Sequelize.INTEGER,
			},
			summoner_revisiondate: {
				type: Sequelize.BIGINT,
			},
			summoner_summonerlevel: {
				type: Sequelize.INTEGER,
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
     	await queryInterface.dropTable('leagueoflegends_summoners');
  	}
};
