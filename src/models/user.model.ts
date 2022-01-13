import { Schema, model } from 'mongoose';

interface User {
	email: string,
	password: string,
	isVerified: boolean,
	verificationCode: string,
}

const UserSchema = new Schema<User>({
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

export default model<User>('User', UserSchema);
