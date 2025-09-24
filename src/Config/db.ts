import mongoose from 'mongoose';

export const connectDb = async () => {
    const dbUsername = process.env.MONGO_USER_NAME ?? '';
    const dbPassword = process.env.MONGO_USER_PASSWORD ?? '';
    const dbHost = process.env.MONGO_HOST ?? '';
    const dbCollection = process.env.MONGO_COLLECTION ?? '';
    await mongoose.connect(`mongodb://${dbUsername}:${dbPassword}@${dbHost}/${dbCollection}?authSource=admin`).then(() => { console.log('Database conected'); }).catch((err: unknown) => { console.log(err, 'error'); })
}