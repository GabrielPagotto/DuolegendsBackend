import axios from "axios";
import { ACCEPTED_TAGLINES, REGION_HOST_AMERICA } from "../constants/leagueoflegends.constants";
import { NotFoundException, ValidationException } from "../exceptions/http.exception";
import { LeagueoflegendsAccountInterface, LeagueoflegendsSumonnerInterface } from "../interfaces/models.interface";
import { AccountByPuuidInterface, LeagueoflegendsErrorInterface, SummonerByNameInterface } from "../interfaces/utils.interface";

export default {
    getLeagueOfLegendsHost: function (tagLine: string): string {
        return `https://${tagLine}.api.riotgames.com`;
    },
    getRiotApiKey: function (): string {
        const riotApiKey = process.env.RIOT_API_KEY;
        if (!riotApiKey) {
            throw new Error("The riot api key was not informed in the environment variables. [RIOT_API_KEY]");
        }
        return riotApiKey;
    },
    getSummonerByName: async function (summonerName: string, tagLine: string): Promise<LeagueoflegendsSumonnerInterface> {
        if (ACCEPTED_TAGLINES.includes(tagLine)) {
            const urlSummoner = this.getLeagueOfLegendsHost(tagLine as string) + `/lol/summoner/v4/summoners/by-name/${summonerName}`;
            const key = this.getRiotApiKey();
            const headers = { "X-Riot-Token": key };
            const resSummoner = await axios.get(urlSummoner, { validateStatus: status => true, headers });
            if (resSummoner.status === 404) {
                throw new NotFoundException("Summoner not found");
            } else if (resSummoner.status !== 200) {
                const err: LeagueoflegendsErrorInterface = resSummoner.data;
                throw new ValidationException(err.status.message, resSummoner.status);
            } else {
                const summonerProps: SummonerByNameInterface = resSummoner.data;
                const summonerAttr: LeagueoflegendsSumonnerInterface = {
                    id: undefined,
                    summonerId: summonerProps.id,
                    summonerAccountid: summonerProps.accountId,
                    summonerPuuid: summonerProps.puuid,
                    summonerName: summonerProps.name,
                    summonerProfileiconid: summonerProps.profileIconId,
                    summonerRevisiondate: summonerProps.revisionDate,
                    summonerSummonerlevel: summonerProps.summonerLevel,
                    createdAt: undefined,
                    updatedAt: undefined,
                };
                return summonerAttr;
            }
        } else {
            throw new ValidationException("Enter a valid tag line parameter");            
        }
    },
    getAccountByPuuid: async function getAccountByPuuid(puuid: string): Promise<LeagueoflegendsAccountInterface> {
        const urlAccount = REGION_HOST_AMERICA + `/riot/account/v1/accounts/by-puuid/${puuid}`;
        const key = this.getRiotApiKey();
        const headers = { "X-Riot-Token": key };
        const resAccount = await axios.get(urlAccount, { validateStatus: status => true, headers });
        if (resAccount.status !== 200) {
            const resErr: LeagueoflegendsErrorInterface = resAccount.data;
            throw new ValidationException(resErr.status.message);
        } else {
            const accountProps: AccountByPuuidInterface = resAccount.data;
            const accountAttr: LeagueoflegendsAccountInterface = {
                id: undefined,
                accountPuuid: accountProps.puuid,
                accountGamename: accountProps.gameName,
                accountTagline: accountProps.tagLine,
                leagueoflegendsSummonerId: undefined,
                createdAt: undefined,
                updatedAt: undefined,
            }
            return accountAttr;
        }
    }    
}