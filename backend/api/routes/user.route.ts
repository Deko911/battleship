import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router()

router.get('/:id', UserController.getUserById)

router.get('/', UserController.getUserByEmail, UserController.getAllUsers)

router.post('/', UserController.createUser)

router.delete('/:id', UserController.deleteUserById)

export default router