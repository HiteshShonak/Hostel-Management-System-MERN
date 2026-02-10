import mongoose from 'mongoose';
import User from '../models/User';
import { config } from 'dotenv';

config();

const updateUserToken = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('✅ Connected to MongoDB');

        const userId = '698b0ed8dbacf36910ded023'; // The user ID from your log

        // You need the actual Expo push token starting with "ExponentPushToken[...]"
        // converting the "howwwww" to a placeholder for now
        const newToken = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]';

        const user = await User.findById(userId);
        if (!user) {
            console.log('❌ User not found');
            return;
        }

        console.log(`👤 User found: ${user.name} (${user.email})`);
        console.log(`Ticket: ${user.pushToken || 'None'}`);

        // Update logic (commented out until you have real token)
        // user.pushToken = newToken;
        // await user.save();
        // console.log('✅ Token updated!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

updateUserToken();
