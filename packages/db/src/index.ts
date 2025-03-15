import mongoose from 'mongoose';
import { ATLAS_DB_URL, NODE_ENV } from '@repo/config/constant';

async function connectToDB(): Promise<void> {
    try {
        if (NODE_ENV === 'dev') {
            await mongoose.connect(ATLAS_DB_URL);
            console.log('Connected to MongoDB');
        }
    } catch (error) {
        console.error('Unable to connect to DB', error);
    }
}

export default connectToDB;
