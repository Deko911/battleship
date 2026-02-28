import type { NextFunction, Request, Response } from "express";
import UserServices from "../services/user.service";
import { parseCreateUser, type UserRecord } from "../models/user";

export default class UserController {
    static async getAllUsers(req: Request, res: Response) {
        const users = await UserServices.getAllUsers()
        return res.json(users)
    }
    
    static async getUserById(req: Request, res: Response) {
        let _id = req.params.id as string
        const user = await UserServices.getFilteredUser({ _id })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        return res.json(user)
    }
    
    static async getUserByEmail(req: Request, res: Response, next: NextFunction) {
        const email = req.query.email as string | undefined
        if (email === undefined) {
            return next()
        }
        const user = await UserServices.getFilteredUser({ email })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        return res.json(user)
    }
    
    static async deleteUserById(req: Request, res: Response) {
        let id = req.params.id as string
        await UserServices.deleteUserById(id)
        return res.status(204).end()
    }
}