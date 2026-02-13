import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router()

router.get('/:id', async (req, res) => {
    const id = req.params.id
    return UserController.getUserById(req, res, id)
})

router.get('/', async (req, res) => {
    const { email } = req.query as { email?: string }
    if (email !== undefined) {
        return await UserController.getUserByEmail(req, res, email)
    }
    return await UserController.getAllUsers(req, res)
})


router.post('/', UserController.createUser)

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    return UserController.deleteUserById(req, res, id)
})

export default router