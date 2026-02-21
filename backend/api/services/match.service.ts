import { type MatchDocumentLean, MatchModel, type MatchRecord, parseMatchDocument } from "../models/match";

export default class MatchService {

    // NO POPULATED
    static async getMatchById(id: string) {
        const match = await MatchModel.findById(id).lean<MatchDocumentLean>().exec();
        if (!match){
            return null
        }
        return match
    }

    static async getMatchesByPlayer(playerId: string) {
        const matches = await MatchModel.find({
            $or: [
                { player1: playerId }, 
                { player2: playerId }
            ] 
        })
            .populate(['player1', 'player2', 'winner'])
            .lean<MatchDocumentLean[]>()
            .exec();

        return matches.map(parseMatchDocument)
    }

    static async getMatchesByPair(player1Id: string, player2Id: string) {
        const matches = await MatchModel.find({ 
            $or: [
                { player1: player1Id, player2: player2Id },
                { player1: player2Id, player2: player1Id }
            ]
        })
            .populate(['player1', 'player2', 'winner'])
            .lean<MatchDocumentLean[]>()
            .exec()
        return matches.map(parseMatchDocument)
    }

    static async getMatchesByPlayerAndResult(playerId: string, won: boolean) {
        const query = won ? { winner: playerId } : { winner: { $ne: playerId } }
        const matches = await MatchModel.find(query)
            .populate(['player1', 'player2', 'winner'])
            .lean<MatchDocumentLean[]>()
            .exec()
        return matches.map(parseMatchDocument)
    }

    static async createMatch(matchData: MatchRecord) {
        const newMatch = await MatchModel.create(matchData)
        const populatedMatch = await newMatch.populate(['player1', 'player2', 'winner'])
        const parsedMatch = parseMatchDocument(populatedMatch as unknown as MatchDocumentLean)
        return parsedMatch
    }

    static async finishMatch(matchId: string, winner: string) {
        const updatedMatch = await MatchModel.findByIdAndUpdate(matchId, { winner, finished: true }, { new: true })
            .lean<MatchDocumentLean>()
            .populate(['player1', 'player2', 'winner'])
            .exec()
        if (!updatedMatch) {
            return null
        }
        return parseMatchDocument(updatedMatch)
    }
}