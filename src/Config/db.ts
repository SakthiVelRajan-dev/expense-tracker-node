import mongoose from 'mongoose';

export const connectDb = async () => {
    const encodedUsername = encodeURIComponent('sakthivelrajan');
    const encodedPassword = encodeURIComponent('Qcsf5hpwaX9UtcaP');
    await mongoose.connect(`mongodb+srv://${encodedUsername}:${encodedPassword}@movies.1iyj5db.mongodb.net/?retryWrites=true&w=majority&appName=Movies`).then(() => console.log('Database conected')).catch(err => console.log(err, 'error'))
}