import type { Request, Response, NextFunction } from "express"
import * as jwt from "jsonwebtoken"
import config from "../../utils/config"

declare global {
    namespace Express {
        interface Request {
            user?: UserRequest
        }
    }
}

export type UserRequest = { id: string, username: string }

export function auth(req: Request, res: Response, next: NextFunction) {
    let authentication = req.headers.authorization ?? ""
    authentication = authentication.startsWith('Bearer ') ? authentication : ""
    const token = authentication.split(' ')[1]
    if (!token) {
        return res.status(401).send({ error: "Missing auth token" })
    }
    
    const user = jwt.verify(token, config.JWT_TOKEN) as UserRequest
    req.user = user
    next()
}