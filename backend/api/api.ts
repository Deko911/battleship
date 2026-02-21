import { Router } from "express";
import userRouter from "./routes/user.route";
import matchRouter from "./routes/match.route";

const apiRouter = Router()

apiRouter.use('/user', userRouter)
apiRouter.use('/match', matchRouter)

export default apiRouter