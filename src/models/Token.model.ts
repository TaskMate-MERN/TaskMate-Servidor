import { Document, PopulatedDoc, Schema, model, Types } from "mongoose";
import { IUser } from "./User.model";

export const TokenType = {
    CONFIRM_ACCOUNT: 'Confirm User',
    PASSWORD_CHANGE: 'Password Change',
} as const;

export interface IToken extends Document{
    token: string;
    type: typeof TokenType[keyof typeof TokenType];
    user: PopulatedDoc<IUser & Document>;
    createdAt: NativeDate;
}

const tokenSchema = new Schema<IToken>({
    token: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        enum: TokenType,
        required: true,
    },

    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: '15m',
    }
}, {timestamps: true});

export const Token = model<IToken>('Token', tokenSchema);