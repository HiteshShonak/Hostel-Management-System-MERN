// src/scripts/seedMessMenu.ts
// Script to populate default mess menu data

import mongoose from 'mongoose';
import MessMenu from '../models/MessMenu';
import { config } from 'dotenv';

config();

const defaultMenuData = [
    {
        day: 'Monday',
        meals: {
            Breakfast: ['Poha', 'Sambar', 'Bread', 'Bananas', 'Tea/Coffee'],
            Lunch: ['Rice', 'Dal Tadka', 'Mix Veg Curry', 'Roti', 'Salad', 'Curd'],
            Dinner: ['Jeera Rice', 'Rajma Curry', 'Roti', 'Pickle', 'Papad'],
        },
        timings: {
            Breakfast: { start: '07:30', end: '09:30' },
            Lunch: { start: '12:00', end: '14:00' },
            Dinner: { start: '19:00', end: '21:00' },
        },
    },
    {
        day: 'Tuesday',
        meals: {
            Breakfast: ['Upma', 'Coconut Chutney', 'Bread', 'Eggs', 'Tea/Coffee'],
            Lunch: ['Rice', 'Sambar', 'Aloo Gobi', 'Roti', 'Salad', 'Buttermilk'],
            Dinner: ['Veg Pulao', 'Paneer Butter Masala', 'Roti', 'Raita'],
        },
        timings: {
            Breakfast: { start: '07:30', end: '09:30' },
            Lunch: { start: '12:00', end: '14:00' },
            Dinner: { start: '19:00', end: '21:00' },
        },
    },
    {
        day: 'Wednesday',
        meals: {
            Breakfast: ['Idli', 'Sambar', 'Coconut Chutney', 'Tea/Coffee'],
            Lunch: ['Rice', 'Dal Fry', 'Cabbage Sabzi', 'Roti', 'Salad', 'Curd'],
            Dinner: ['Roti', 'Chana Masala', 'Veg Raita', 'Pickle'],
        },
        timings: {
            Breakfast: { start: '07:30', end: '09:30' },
            Lunch: { start: '12:00', end: '14:00' },
            Dinner: { start: '19:00', end: '21:00' },
        },
    },
    {
        day: 'Thursday',
        meals: {
            Breakfast: ['Aloo Paratha', 'Curd', 'Pickle', 'Tea/Coffee'],
            Lunch: ['Rice', 'Kadhi', 'Bhindi Fry', 'Roti', 'Salad', 'Papad'],
            Dinner: ['Rice', 'Dal Makhani', 'Mix Veg', 'Roti', 'Salad'],
        },
        timings: {
            Breakfast: { start: '07:30', end: '09:30' },
            Lunch: { start: '12:00', end: '14:00' },
            Dinner: { start: '19:00', end: '21:00' },
        },
    },
    {
        day: 'Friday',
        meals: {
            Breakfast: ['Dosa', 'Sambar', 'Coconut Chutney', 'Tea/Coffee'],
            Lunch: ['Rice', 'Dal Palak', 'Aloo Matar', 'Roti', 'Salad', 'Curd'],
            Dinner: ['Veg Biryani', 'Raita', 'Papad', 'Gulab Jamun'],
        },
        timings: {
            Breakfast: { start: '07:30', end: '09:30' },
            Lunch: { start: '12:00', end: '14:00' },
            Dinner: { start: '19:00', end: '21:00' },
        },
    },
    {
        day: 'Saturday',
        meals: {
            Breakfast: ['Puri Bhaji', 'Jalebi', 'Tea/Coffee'],
            Lunch: ['Rice', 'Sambar', 'Baingan Bharta', 'Roti', 'Salad', 'Buttermilk'],
            Dinner: ['Roti', 'Shahi Paneer', 'Jeera Rice', 'Papad'],
        },
        timings: {
            Breakfast: { start: '07:30', end: '09:30' },
            Lunch: { start: '12:00', end: '14:00' },
            Dinner: { start: '19:00', end: '21:00' },
        },
    },
    {
        day: 'Sunday',
        meals: {
            Breakfast: ['Chole Bhature', 'Pickle', 'Tea/Coffee'],
            Lunch: ['Rice', 'Dal Tadka', 'Palak Paneer', 'Roti', 'Salad', 'Curd', 'Sweet (Halwa)'],
            Dinner: ['Fried Rice', 'Manchurian', 'Spring Rolls', 'Soup'],
        },
        timings: {
            Breakfast: { start: '07:30', end: '09:30' },
            Lunch: { start: '12:00', end: '14:00' },
            Dinner: { start: '19:00', end: '21:00' },
        },
    },
];

async function seedMessMenu() {
    try {
        console.log('🌱 Starting mess menu seed...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('✅ Connected to MongoDB');

        // Check if data already exists
        const existingCount = await MessMenu.countDocuments();

        if (existingCount > 0) {
            console.log(`⚠️  Found ${existingCount} existing menus. Do you want to replace them?`);
            console.log('Run with --force to replace existing data');

            // Only replace if --force flag is provided
            if (!process.argv.includes('--force')) {
                console.log('Skipping seed. Use --force to replace existing data.');
                process.exit(0);
            }

            console.log('🗑️  Clearing existing menu data...');
            await MessMenu.deleteMany({});
        }

        // Insert default menu data
        console.log('📝 Inserting default menu data...');
        await MessMenu.insertMany(defaultMenuData);

        console.log('✅ Successfully seeded mess menu with default data!');
        console.log('📋 Added menus for all 7 days of the week');
        console.log('🕐 Default timings: Breakfast (7:30-9:30), Lunch (12:00-14:00), Dinner (19:00-21:00)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding mess menu:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    seedMessMenu();
}

export default seedMessMenu;
