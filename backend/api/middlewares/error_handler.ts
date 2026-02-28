import type { Request, Response, NextFunction } from "express";

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (err.name === 'ValidationError') {
        const errMongo = err as Error & { errors: Record<string, Error> }
        const error: Record<string, string> = {}

        for (const key in errMongo.errors) {
            if (!Object.hasOwn(errMongo.errors, key)) continue;
            error[key] = errMongo.errors[key]!.message
        }

        return res.status(400).json({ error })
    } else if (err.name === "MongooseError") {
        return res.status(400).json({ error: err.message })
    } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'invalid token'
        })
    } else if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'token expired'
        })
    }
    
    res.status(500).send({ error: err.message })
    next(err)
}