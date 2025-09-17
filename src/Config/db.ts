import mongoose from 'mongoose';

export const connectDb = async () => {
    const encodedUsername = encodeURIComponent(process.env.MONGO_USER_NAME ?? '');
    const encodedPassword = encodeURIComponent(process.env.MONGO_USER_PASSWORD ?? '');
    await mongoose.connect(`mongodb+srv://${encodedUsername}:${encodedPassword}@${process.env.MONGO_COLLECTION ?? ''}/?retryWrites=true&w=majority&appName=Movies`).then(() => { console.log('Database conected'); }).catch((err: unknown) => { console.log(err, 'error'); })
}