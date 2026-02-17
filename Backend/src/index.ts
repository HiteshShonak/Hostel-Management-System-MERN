import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';
import GatePass from './models/GatePass';
import mongoose from 'mongoose';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

let server: any;

const startServer = async () => {
    try {
        // connect to mongo
        await connectDB();

        // fix unique indexes if they're messed up
        await GatePass.syncIndexes();
        logger.info('GatePass indexes synced');

        // fire up the express server
        server = app.listen(PORT, () => {
            // in dev we want the link, in prod just the port is fine
            const env = process.env.NODE_ENV || 'development';
            const logUrl = env === 'development' ? `http://localhost:${PORT}` : `Port ${PORT}`;

            logger.info('Server is live 🚀', { port: PORT, env, url: logUrl });

            // tell pm2 we're good to go
            if (process.send) {
                process.send('ready');
            }
        });
    } catch (error) {
        logger.error('Failed to start server', { error: error instanceof Error ? error.message : String(error) });
        process.exit(1);
    }
};

// Graceful shutdown handler for PM2 cluster mode
const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    // Stop accepting new connections
    if (server) {
        server.close(() => {
            logger.info('HTTP server closed');
        });
    }

    try {
        // Close MongoDB connection
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');

        logger.info('Graceful shutdown completed');
        process.exit(0);
    } catch (error) {
        logger.error('Error during shutdown', { error: error instanceof Error ? error.message : String(error) });
        process.exit(1);
    }
};

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason: any) => {
    logger.error('Unhandled Rejection', { reason: reason?.message || reason });
});

startServer();
