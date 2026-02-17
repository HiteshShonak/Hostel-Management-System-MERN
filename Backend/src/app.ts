// src/app.ts
// main express app setup

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

// keeping things clean
import { errorHandler } from './middleware/error.middleware';
import { sanitizeInput } from './middleware/sanitize.middleware';

// all our api routes
import routes from './routes';

const app = express();

app.set('trust proxy', 1);

// gzip to make responses faster
app.use(compression());

// basic security headers
app.use(helmet());

// handling cors for frontend access
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [];
app.use(cors({
    origin: (origin, callback) => {
        // allow apps/postman with no origin
        if (!origin) return callback(null, true);

        // allow localhost for dev work
        const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');

        // check against whitelist
        if (allowedOrigins.includes(origin) || isLocalhost) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// log requests in dev mode so we can see what's happening
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// parsing json bodies (limited to 1mb for safety)
app.use(express.json({ limit: '1mb' }));

// parsing url-encoded data
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// clean up input to prevent nasty xss attacks
app.use(sanitizeInput);

// simple health check to see if server is alive
app.get('/health', (req, res) => {
    const memoryUsage = process.memoryUsage();
    res.status(200).json({
        success: true,
        message: 'HMS Backend is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        uptime: Math.floor(process.uptime()),
        memory: {
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        },
        version: process.env.npm_package_version || '1.0.0',
    });
});

// where all the api magic happens
app.use('/api', routes);

// 404 handler for lost requests
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// global error handler (keep this at the bottom!)
app.use(errorHandler);

export default app;
