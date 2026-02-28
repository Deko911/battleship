import config from "../../utils/config";
import type { UserDocumentParsed } from "../models/user";
import { sign } from "jsonwebtoken";

export default class AuthService {
    static generateToken(user: UserDocumentParsed) {
        return sign({ id: user.id, username: user.username }, config.JWT_TOKEN)
    }
}