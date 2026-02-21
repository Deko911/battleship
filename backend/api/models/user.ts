import { Schema, model, type Document } from "mongoose";

export interface UserDocument extends Document {
    username: string,
    email: string,
    password: string,
    wins: number
}

export interface UserRecord {
    username: string,
    email: string,
    password: string
    wins?: number
}

const userSchema = new Schema<UserDocument>({
        username: {
            type: String,
            required: [true, "Username is required"],
            minLength: [3, "Username is too short"],
            maxLength: [25, "Username is too large"]
        },
        email: {
            unique: [true, "Email has already used"],
            type: String,
            required: [true, "Email is required"],
            minlength: [5, "email is too short"],
            match: [/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, "Email is not valid"],
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            minLength: [8, "Password too short"],
            validate: {
                validator: function (v) {
                    const lowerValidation = /[a-z]/;
                    const upperValidation = /[A-Z]/;
                    const numberValidation = /\d/;
                    if (!lowerValidation.test(v)) {
                        throw new Error('Passworld must contain at least a lowercase letter')
                    }
                    if (!upperValidation.test(v)) {
                        throw new Error('Passworld must contain at least a uppercase letter')
                    }
                    if (!numberValidation.test(v)) {
                        throw new Error('Passworld must contain at least a number')
                    }
                    return true
                }
            },
            required: [true, "Password is required"]
        },
        wins: {
            type: Number,
            min: [0, "Wins cannot be negative"],
            default: 0
        }
    }
)

userSchema.index({ wins: -1 })

export const UserModel = model<UserDocument>('User', userSchema)

export type UserDocumentParsed = {
    id: string,
    username: string,
    email: string,
    wins: number,
}

export type UserDocumentLean = UserDocument & { __v?: number }

export const parseUserDocument = (user: UserDocumentLean): UserDocumentParsed => {
    const {_id, password: _passworld, __v: _version, ...rest} = user;
    return {
        id: _id.toString(),
        username: rest.username,
        email: rest.email,
        wins: rest.wins
    }
}