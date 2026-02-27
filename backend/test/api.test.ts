import { test, after, describe, beforeEach } from 'node:test'
import assert from 'assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../index'
import { initialUsers, initialMatches, initDb, playerIds, playersMatchIds, matchIds } from '../utils/seed'

const api = supertest(app)

beforeEach(async () => {
    await initDb()
})

 describe('Users', async () => {
    test('users are returned as json', async () => {
        await api
            .get('/api/user')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all users were saved', async () => {
        const response = await api.get('/api/user')
        assert.strictEqual(initialUsers.length, response.body.length)
    })

    test('users password is not accesible', async () => {
        const response = await api.get('/api/user')
        const user = response.body[0]
        assert.strictEqual(user.password, undefined)
    })

    test('users can be getted by email', async () => {
        const user = initialUsers[0]!
        const response = await api.get(`/api/user?email=${user.email}`)
            .expect(200)
        const gettedUser = response.body
        const {password: _password, ...expectedUser} = {...gettedUser, ...user}
        
        assert.ok(gettedUser)
        assert.deepStrictEqual(expectedUser, gettedUser)
    })

    test('users can be getted by id', async () => {
        const user = initialUsers[0]!
        const userId = playerIds[user.username]
        const response = await api.get(`/api/user/${userId}`)
            .expect(200)
        const gettedUser = response.body
        const {password: _password, ...expectedUser} = {...gettedUser, ...user}
        
        assert.ok(gettedUser)
        assert.deepStrictEqual(expectedUser, gettedUser)
    })

    test('users can be created safely', async () => {
        const user = {
            username: "Taylor",
            email: "taylor@email.com",
            password: "Taylor.1234"
        }
        const response = await api.post('/api/user').send(user).expect(201)
        const createdUser = response.body
        const {password: _password, ...expectedUser} = {...createdUser, ...user}

        assert.deepStrictEqual(expectedUser, createdUser)
    })

    test('sending more information will be ignored', async () => {
        const user = {
            username: "Taylor",
            email: "taylor@email.com",
            password: "Taylor.1234",
            foo: '1234',
            wins: 10
        }
        const response = await api.post('/api/user').send(user).expect(201)
        const createdUser = response.body
        const {password: _password, foo: _foo, ...expectedUser} = {...createdUser, ...user, wins: 0}

        assert.deepStrictEqual(expectedUser, createdUser)
    })

    test('sending missing information will throw error', async () => {
        const user = {
            username: "Taylor",
            password: "Taylor.1234"
        }
        await api.post('/api/user').send(user).expect(400)
    })
})


describe('Matches', async () => {
    test('matches are returned as json', async () => {
        const player = playersMatchIds[0]!.player1
        await api
            .get(`/api/match?playerId=${player}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all matches were saved', async () => {
        for (const match of playersMatchIds) {
            const player = match.player1
            await api
                .get(`/api/match?playerId=${player}`)
                .expect(200)
        }
    })

    test('information of players in the match is safe', async () => {
        const player = playersMatchIds[0]!.player1
        const response = await api.get(`/api/match?playerId=${player}`)
        const match = response.body[0]
        const expectedMatch = {
            ...match, 
            player1: { id: match.player1.id, username: match.player1.username },
            player2: { id: match.player2.id, username: match.player2.username }
        }
        assert.deepStrictEqual(match, expectedMatch)
    })

    describe('Players in match are valid', async () => {
        test('Filter by user', async () => {
            const player = playersMatchIds[0]!.player1
            const response = await api.get(`/api/match?playerId=${player}`);
            const match = response.body[0]
            assert.ok(match.player1.id === player || match.player2.id === player)
        })

        test('Filter by user and won', async () => {
            const player = playersMatchIds[0]!.player1
            const matchId = matchIds[0]
            await api.patch(`/api/match/finish/${matchId}`).send({ winnerId: player })
            const response = await api.get(`/api/match?playerId=${player}&won=true`);
            const match = response.body[0]
            assert.ok(match.player1.id === player || match.player2.id === player)
            assert.strictEqual(match.winner.id, player)
        })

        test('Filter by pair', async () => {
            const player1 = playersMatchIds[0]!.player1
            const player2 = playersMatchIds[0]!.player2
            const response = await api.get(`/api/match?players=${player1},${player2}`);
            const match = response.body[0]
            assert.ok(match.player1.id === player1 || match.player2.id === player1)
            assert.ok(match.player1.id === player2 || match.player2.id === player2)
        })
    })

    test('matches can be created safely', async () => {
        const player1 = playerIds[initialUsers[4]!.username]
        const player2 = playerIds[initialUsers[5]!.username]
        const match = {
            player1,
            player2
        }
        const response = await api.post('/api/match').send(match).expect(201)
        const createdMatch = response.body

        assert.ok(createdMatch.player1.id === player1 || createdMatch.player2.id === player1)
        assert.ok(createdMatch.player1.id === player2 || createdMatch.player2.id === player2)
        assert.ok(!createdMatch.winner)
        assert.ok(!createdMatch.finished)
    })

    test('sending more information will be ignored', async () => {
        const player1 = playerIds[initialUsers[4]!.username]
        const player2 = playerIds[initialUsers[5]!.username]
        const match = {
            player1,
            player2,
            foo: '123'
        }
        const response = await api.post('/api/match').send(match).expect(201)
        const createdMatch = response.body

        assert.ok(createdMatch.player1.id === player1 || createdMatch.player2.id === player1)
        assert.ok(createdMatch.player1.id === player2 || createdMatch.player2.id === player2)
        assert.ok(!createdMatch.winner)
        assert.ok(!createdMatch.finished)
        assert.ok(!createdMatch.foo)
    })

    test('if player is in other match, throw error', async () => {
        const { player1, player2 } = playersMatchIds[0]!
        const match = {
            player1,
            player2
        }
        await api.post('/api/match').send(match).expect(400)
    })

    test('sending missing information will throw error', async () => {
        const player1 = playerIds[initialUsers[4]!.username]
        const match = {
            player1
        }
        await api.post('/api/match').send(match).expect(400)
    })
})

after(async () => {
    await mongoose.connection.close()
})