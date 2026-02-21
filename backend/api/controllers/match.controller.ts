import type { NextFunction, Request, Response } from "express";
import type { MatchRecord } from "../models/match";
import MatchService from "../services/match.service";
import UserServices from "../services/user.service";

export default class MatchController {
    static async getMatchesByPlayer(req: Request, res: Response, next: NextFunction) {
        const id = req.query.playerId as string | null
        if (!id) {
            return next()
        }
        const matches = await MatchService.getMatchesByPlayer(id)
        return res.json(matches)
    }

    static async getMatchesByPair(req: Request, res: Response, next: NextFunction) {
        const players = req.query.players as string | undefined 
        const [player1Id, player2Id] = (players || '').split(',')
        if (!player1Id || !player2Id) {
            return next()
        }
        const matches = await MatchService.getMatchesByPair(player1Id, player2Id)
        return res.json(matches)
    }

    static async getMatchesByPlayerAndResult(req: Request, res: Response, next: NextFunction) {
        const { playerId: id, won } = req.query as { playerId?: string, won?: string }
        if (!won || !id) {
            return next()
        }
        const matches = await MatchService.getMatchesByPlayerAndResult(id, Boolean(won))
        return res.json(matches)
    }

    static async createMatch(req: Request, res: Response) {
        const matchData: MatchRecord = req.body
        const newMatch = await MatchService.createMatch(matchData)
        return res.json(newMatch)
    }

    static async finishMatch(req: Request, res: Response) {
        const id = req.params.matchId as string
        const winnerId = req.body.winnerId as string
        const match = await MatchService.getMatchById(id)
        if (!match) {
            return res.status(404).json({ error: 'Match does not found' })
        }
        if (match.finished) {
            return res.status(400).json({ error: 'Match is already finished' })
        }
        console.log(match, winnerId);
        if (match.player1.toString() !== winnerId && match.player2.toString() !== winnerId) {
            return res.status(400).json({ error: 'Player is not in the match' })
        }
        UserServices.updateWinsById(winnerId)

        const updatedMatch = await MatchService.finishMatch(id, winnerId)
        return res.json(updatedMatch)
    }
}