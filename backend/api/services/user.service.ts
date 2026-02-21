import bcrypt from "bcryptjs";
import { parseUserDocument, UserModel, type UserRecord } from "../models/user";
import config from "../../utils/config";

type UserFilters = {
    _id?: string,
    email?: string
}

export default class UserServices {
    static async getAllUsers() {
        const users = await UserModel.find({}).sort({ wins: -1 }).lean().exec()
        return users.map(parseUserDocument)
    }

    static async getFilteredUser(filter: UserFilters) {
        let filters: Record<string, unknown> = {};
        for (const key of Object.keys(filter)) {
            const filt = filter[key as keyof UserFilters];
            if (filt !== undefined) {
                filters[key] = filt
            }
        }
        const user = await UserModel.findOne(filter).lean().exec()
        if (!user) {return null}
        return parseUserDocument(user)
    }

    static async createUser(user: UserRecord) {
        if (user.password) {
            user.password = await bcrypt.hash(user.password, Number(config.SALT_ROUNDS))
        }
        let newUser = await UserModel.create(user)
        return parseUserDocument(newUser.toObject());
    }

    static async deleteUserById(id: string) {
        return UserModel.findByIdAndDelete(id).exec()
    }

    static async updateWinsById(id: string) {
        return UserModel.findByIdAndUpdate(id, { $inc: { wins: 1 } }, { new: true })
    }
}