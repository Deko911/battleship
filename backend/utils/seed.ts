import { UserModel } from "../api/models/user";
import { MatchModel } from "../api/models/match";
import bcrypt from "bcryptjs";
import config from "./config";
import mongoose from "mongoose";
import connectDB from "./db";

export const initialUsers = [
    {
        username: 'Deko',
        email: 'tu@email.com',
        password: 'Deko.Dev911',
        wins: 5
    },
    {
        username: 'Jose',
        email: 'jose@email.com',
        password: 'Jose.123',
        wins: 1
    },
    {
        username: 'Camilo',
        email: 'camilo@email.com',
        password: 'Camilo.123',
        wins: 0
    },
    {
        username: 'Maria',
        email: 'maria@email.com',
        password: 'Maria.123',
        wins: 10
    },
    {
        username: 'Juan',
        email: 'juan@email.com',
        password: 'Juan.123',
        wins: 3
    },
    {
        username: 'Pepe',
        email: 'Pepe@email.com',
        password: 'Pepe.123',
        wins: 7
    },
]

export const initialMatches = [
    {
        player1: 'Deko',
        player2: 'Jose'
    },
    {
        player1: 'Camilo',
        player2: 'Maria'
    }
]

export let playerIds: Record<string, string> = {}

export let matchIds: string[] = []

export let playersMatchIds: { player1: string, player2: string }[] = []

export async function initDb() {
    if (!mongoose.connection.db) {
        await connectDB()
    }
    playerIds = {}
    playersMatchIds = []
    matchIds = []
    await UserModel.deleteMany({})
    await MatchModel.deleteMany({})
    for (const user of initialUsers) {
        const parsedUser = {...user}
        parsedUser.password = await bcrypt.hash(user.password, Number(config.SALT_ROUNDS))
        const createdUser = await UserModel.create(parsedUser)
        playerIds[parsedUser.username] = createdUser._id.toString()
    }

    for (const match of initialMatches) {
        const player1 = playerIds[match.player1]!
        const player2 = playerIds[match.player2]!
        const parsedMatch = { player1, player2 }
        playersMatchIds.push(parsedMatch)
        const createdMatch = await MatchModel.create(parsedMatch)
        await UserModel.findByIdAndUpdate(player1, { currentMatch: createdMatch._id })
        await UserModel.findByIdAndUpdate(player2, { currentMatch: createdMatch._id })
        matchIds.push(createdMatch._id.toString())
    }
}
