export interface SummonerByNameInterface {
    id: string;
    accountId: string;
    puuid: string;
    name: string;
    profileIconId: number;
    revisionDate: number;
    summonerLevel: number;
}

export interface AccountByPuuidInterface {
    puuid: string;
    gameName: string;
    tagLine: string;
}

export interface LeagueoflegendsErrorInterface {
    status: {
        message: string,
        "status_code": number,
    }
}
