import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hms';

        await mongoose.connect(mongoURI);

        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('MongoDB connection error', { error: error instanceof Error ? error.message : String(error) });
        process.exit(1);
    }
};

export default connectDB;
