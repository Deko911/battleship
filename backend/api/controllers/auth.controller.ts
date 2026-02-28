import { type UserRecord, parseCreateUser, parseUserDocument } from "../models/user"
import type { Response, Request } from "express"
import UserServices from "../services/user.service"
import AuthService from "../services/auth.service"
import bcrypt from "bcryptjs"

export default class AuthController {
    static async register(req: Request, res: Response) {
        const userData: UserRecord = parseCreateUser(req.body)
        const newUser = await UserServices.createUser(userData)
        const token = AuthService.generateToken(newUser)
        return res.status(201).json({ token, user: newUser })
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body as { email: string, password: string }
        const user = await UserServices.getFilteredUnParsedUser({ email })
        if (!user) {
            return res.status(404).send({ error: "User does not found" })
        }

        const success = await bcrypt.compare(password, user.password)

        if (!success) {
            return res.status(401).send({ error: "Invalid password" })
        }
        
        const token = AuthService.generateToken(parseUserDocument(user))

        return res.json({ token })
    }
}