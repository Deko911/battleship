import { Router } from "express";
import userRouter from "./routes/user.route";
import matchRouter from "./routes/match.route";
import errorHandler from "./middlewares/error_handler";

const apiRouter = Router()

apiRouter.use('/user', userRouter)
apiRouter.use('/match', matchRouter)

apiRouter.use(errorHandler)

export default apiRouter