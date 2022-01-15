import { Schema, model, Model } from 'mongoose';

export interface UserInterface {
	email: string,
	password: string,
	isVerified: boolean,
	verificationCode: string,
}

export const UserSchema = new Schema<UserInterface>({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	isVerified: {
		type: Boolean,
		default: false,
		required: true,
	},
	verificationCode: {
		type: String,
	}, 
}, { timestamps: true });

export const User: Model<UserInterface> = model<UserInterface>('User', UserSchema);
