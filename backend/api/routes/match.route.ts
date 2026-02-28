import { Router } from "express";
import MatchController from "../controllers/match.controller";
import { auth } from "../middlewares/auth";

const router = Router()

router.get('/', MatchController.getMatchesByPlayerAndResult, MatchController.getMatchesByPlayer, MatchController.getMatchesByPair)

router.post('/', auth, MatchController.createMatch)

router.patch('/finish/:matchId', auth, MatchController.finishMatch)

export default router