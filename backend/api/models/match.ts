import { Schema, Types, model, type Document } from "mongoose";
import type { UserDocumentLean, UserDocumentParsed } from "./user";

export interface MatchDocument extends Document {
    player1: Types.ObjectId,
    player2: Types.ObjectId,
    finished: boolean,
    winner: Types.ObjectId | null,
    date: Date
}

const MatchSchema = new Schema<MatchDocument>({
    player1: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Player1 is required"]
    },
    player2: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Player2 is required"]
    },
    finished: {
        type: Boolean,
        default: false
    },
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

MatchSchema.index({ player1: 1, player2: 1 })
MatchSchema.index({ winner: 1 })
MatchSchema.index({ finished: 1 })
MatchSchema.index({ date: -1 })

export const MatchModel = model<MatchDocument>('Match', MatchSchema)

type PopulatedUser = Pick<UserDocumentParsed, 'id' | 'username'>

export type MatchDocumentParsed = {
    id: string,
    player1: PopulatedUser,
    player2: PopulatedUser,
    finished: boolean,
    winner: PopulatedUser | null,
    date: Date
}

export type MatchRecord = {
    player1: string,
    player2: string
}

export type MatchDocumentLean = {
    _id: Schema.Types.ObjectId,
    player1: UserDocumentLean,
    player2: UserDocumentLean,
    finished: boolean,
    winner: UserDocumentLean | null,
    date: Date
}

export function parseMatchDocument(match: MatchDocumentLean): MatchDocumentParsed {
    const player1 = {
        id: match.player1._id.toString(),
        username: match.player1.username
    }
    const player2 = {
        id: match.player2._id.toString(),
        username: match.player2.username
    }
    const winner = match.winner == null ? null : {
        id: match.winner._id.toString(),
        username: match.winner.username
    }
    return {
        id: match._id.toString(),
        player1: player1,
        player2: player2,
        winner: winner,
        finished: match.finished,
        date: match.date
    }
}

export function parseCreateMatch(match: any): MatchRecord {
    return {
        player1: match.player1,
        player2: match.player2
    }
}