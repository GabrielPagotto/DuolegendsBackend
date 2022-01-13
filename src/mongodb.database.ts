import mongoose from 'mongoose';


export function initConnection() {
	const mongooseConnection = process.env.MONGODB_CONNECTION;

	if (mongooseConnection) {
		mongoose.connect(mongooseConnection);
	}
}
