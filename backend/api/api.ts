import { Router } from "express";
import userRouter from "./routes/user.route";

const apiRouter = Router()

apiRouter.use('/user', userRouter)

export default apiRouter