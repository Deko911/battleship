import { Router } from "express";
import MatchController from "../controllers/match.controller";

const router = Router()

router.get('/', MatchController.getMatchesByPlayerAndResult, MatchController.getMatchesByPlayer, MatchController.getMatchesByPair)

router.post('/', MatchController.createMatch)

router.patch('/finish/:matchId', MatchController.finishMatch)

export default router