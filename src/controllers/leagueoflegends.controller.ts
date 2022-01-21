import { Request, Response, Router } from "express";
import { Controller } from "../server";
import axios from "axios";
import { NotFoundException, ValidationException } from "../exceptions/http.exception";
import { ACCEPTED_TAGLINES, REGION_HOST_AMERICA } from "../constants/leagueoflegends.constants";
import { getLeagueOfLegendsHost as getLeagueOfLegendsHostByTagLine } from "../utils/leagueoflegends.utils";
import { LeagueoflegendsSummoner, LeagueoflegendsSumonnerAttribute } from "../models/leagueoflegends_summoner";
import { LeagueoflegendsAccount, LeagueoflegendsAccountAttribute } from "../models/leagueoflegends_account";
import { User } from "../models/user.model";

interface SummonerByNameInterface {
    id: string;
    accountId: string;
    puuid: string;
    name: string;
    profileIconId: number;
    revisionDate: number;
    summonerLevel: number;
}

interface AccountByPuuidInterface {
    puuid: string;
    gameName: string;
    tagLine: string;
}

interface LeagueoflegendsErrorInterface {
    status: {
        message: string,
        "status_code": number,
    }
}

export default class LeagueoflegendsController extends Controller {
    public path: string = "/leagueoflegends";
    public router: Router = Router();
    public initializeRoutes(): void {
        this.router.put('/set-account-by-summoner-name', this.setAccountBySummonerName);
    }

    private static getRiotApiKey(): string {
        const riotApiKey = process.env.RIOT_API_KEY;
        if (!riotApiKey) {
            throw new Error("The riot api key was not informed in the environment variables. [RIOT_API_KEY]");
        }
        return riotApiKey;
    }

    private async setAccountBySummonerName(req: Request, res: Response): Promise<Response> {
        let { summonerName, tagLine } = req.query;
        if (!summonerName) {
            throw new ValidationException("Summoner name not provided");
        } else if (!tagLine) {
            throw new ValidationException("Enter the tag line parameter");            
        } else {
            if (ACCEPTED_TAGLINES.includes(tagLine as string)) {
                const urlSummoner = getLeagueOfLegendsHostByTagLine(tagLine as string) + `/lol/summoner/v4/summoners/by-name/${summonerName}`;
                const key = LeagueoflegendsController.getRiotApiKey();
                const headers = { "X-Riot-Token": key };
                const resSummoner = await axios.get(urlSummoner, { validateStatus: status => true, headers });
                if (resSummoner.status === 404) {
                    throw new NotFoundException("Summoner not found");
                } else {
                    try {
                        const summonerProps: SummonerByNameInterface = resSummoner.data;
                        const urlAccount = REGION_HOST_AMERICA + `/riot/account/v1/accounts/by-puuid/${summonerProps.puuid}`;
                        const resAccount = await axios.get(urlAccount, { validateStatus: status => true, headers });
                        if (resAccount.status !== 200) {
                            const resErr: LeagueoflegendsErrorInterface = resAccount.data;
                            throw new ValidationException(resErr.status.message);
                        } else {
                            const summonerAttr: LeagueoflegendsSumonnerAttribute = {
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
                            const leagueoflegendsSummoner = await LeagueoflegendsSummoner.create(summonerAttr);
                            const accountProps: AccountByPuuidInterface = resAccount.data;
                            const accountAttr: LeagueoflegendsAccountAttribute = {
                                id: undefined,
                                accountPuuid: accountProps.puuid,
                                accountGamename: accountProps.gameName,
                                accountTagline: accountProps.tagLine,
                                leagueoflegendsSummonerId: leagueoflegendsSummoner.id,
                                createdAt: undefined,
                                updatedAt: undefined,
                            }
                            const leagueoflegendsAccount = await LeagueoflegendsAccount.create(accountAttr);
                            const user = await User.findByPk(1);
                            if (!user) {
                                throw new NotFoundException("User not found");
                            }
                            user.leagueoflegendsAccountId = leagueoflegendsAccount.id;
                            await user.save();
                            return res.json({ ...leagueoflegendsAccount, leagueoflegendsSummoner: leagueoflegendsSummoner });
                        }
                    } catch (err) {
                        console.log(err);
                        return res.json();
                    } 
                }
            } else {
                throw new ValidationException("Enter a valid tag line parameter");            
            }
        }
    }
}
