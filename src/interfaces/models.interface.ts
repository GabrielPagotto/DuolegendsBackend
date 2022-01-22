export interface LeagueoflegendsAccountInterface {
	id: number | undefined,
	accountPuuid: string,
	accountGamename: string,
	accountTagline: string,
	leagueoflegendsSummonerId: number | undefined,
	createdAt: Date | undefined,
	updatedAt: Date | undefined,
}

export interface LeagueoflegendsSumonnerInterface {
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

export interface UserInterface {
	id: number,
	email: string,
	password: string,
	leagueoflegendsVerified: boolean,
	leagueoflegendsVerificationCode: string,
	leagueoflegendsAccountId: number | undefined | null,
	createdAt: Date,
	updatedAt: Date,
}
