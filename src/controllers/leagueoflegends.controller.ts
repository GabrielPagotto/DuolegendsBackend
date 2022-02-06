import { Request, Response, Router } from "express";
import { Controller } from "../server";
import { NotAcceptable, NotFoundException, ValidationException } from "../exceptions/http.exception";
import { LeagueoflegendsSummoner } from "../models/leagueoflegends_summoner";
import { LeagueoflegendsAccount } from "../models/leagueoflegends_account";
import { User } from "../models/user.model";
import leagueoflegendsUtil from "../utils/leagueoflegends.util";
import authMiddleware from "../middlewares/auth.middleware";
import { LeagueoflegendsAccountInterface, LeagueoflegendsSumonnerInterface, UserInterface } from "../interfaces/models.interface";

export default class LeagueoflegendsController extends Controller {
    public path: string = "/leagueoflegends";
    public router: Router = Router();
    public initializeRoutes(): void {
        this.router.put('/set-account-by-summoner-name', authMiddleware, this.setAccountBySummonerName);
    }
    public authenticationRequired: boolean = true;

    private async setAccountBySummonerName(req: Request, res: Response): Promise<Response> {
        let { summonerName, tagLine } = req.query;

        if (!summonerName) {
            throw new ValidationException("summoner-name-not-provided");
        }
        
        if (!tagLine) {
            throw new ValidationException("tag-line-not-provided");            
        }

        const summonerAttr = await leagueoflegendsUtil.getSummonerByName(summonerName as string, tagLine as string);
        const data = await LeagueoflegendsSummoner.findOne({ where: { summonerId: summonerAttr.summonerId }, include: [
            { association: 'leagueoflegendsAccount', include: [{ association: 'user' }]},
        ]});
        const { userId } = req.params;
        const summoner = data?.toJSON() as LeagueoflegendsSumonnerInterface & { leagueoflegendsAccount: LeagueoflegendsAccountInterface  & { user: UserInterface  }};

        if (summoner) {
            if (summoner.leagueoflegendsAccount.user.id !== Number(userId.toString()) && summoner.leagueoflegendsAccount.user.leagueoflegendsVerified) {
                throw new NotAcceptable("summoner-has-user");
            }
        }

        const user = await User.findByPk(userId);

        if (!user) {
            throw new NotFoundException("user-not-found");
        }

        if (user.leagueoflegendsAccountId) {
            const leagueoflegendsAccount = await LeagueoflegendsAccount.findByPk(user.leagueoflegendsAccountId);
            await user.update({ leagueoflegendsAccountId: null, leagueoflegendsVerified: false });

            if (leagueoflegendsAccount) {
                if (leagueoflegendsAccount.leagueoflegendsSummonerId) {
                    const leagueoflegendsSummoner = await LeagueoflegendsSummoner.findByPk(leagueoflegendsAccount.leagueoflegendsSummonerId);

                    await leagueoflegendsAccount?.destroy();
                    await leagueoflegendsSummoner?.destroy();
                }
            }
        }

        const accountAttr = await leagueoflegendsUtil.getAccountByPuuid(summonerAttr.summonerPuuid);
        const leagueoflegendsSummoner = await LeagueoflegendsSummoner.create(summonerAttr);

        accountAttr.leagueoflegendsSummonerId = leagueoflegendsSummoner.id;

        const leagueoflegendsAccount: LeagueoflegendsAccount = await LeagueoflegendsAccount.create(accountAttr);

        user.leagueoflegendsAccountId = leagueoflegendsAccount.id;
        await user.save();

        const resData: LeagueoflegendsAccountInterface & { leagueoflegendsSummoner: LeagueoflegendsSumonnerInterface } = leagueoflegendsAccount.toJSON();
        
        resData.leagueoflegendsSummoner = leagueoflegendsSummoner;
        return res.json(resData);
    }
}
