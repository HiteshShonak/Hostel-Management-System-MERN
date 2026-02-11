// src/app.ts
// Express application setup with production-grade configuration

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

// Middleware
import { errorHandler } from './middleware/error.middleware';
import { sanitizeInput } from './middleware/sanitize.middleware';

// Routes
import routes from './routes';

// Firebase Admin (initialize on startup)
import { initializeFirebaseAdmin } from './services/firebase-admin.service';

const app = express();

app.set('trust proxy', 1);

// Initialize Firebase Admin SDK (graceful fail if not configured)
initializeFirebaseAdmin();

// Gzip compression for all responses (25-40% size reduction)
app.use(compression());

// Security headers
app.use(helmet());

// Enable CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Allow all localhost variations (localhost, 127.0.0.1, any port)
        const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');

        // Allow if origin is in whitelist OR is localhost (for development)
        if (allowedOrigins.includes(origin) || isLocalhost) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Request logging (dev mode only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Parse JSON bodies (reduced from 10mb to 1mb for security)
app.use(express.json({ limit: '1mb' }));

// Parse URL-encoded bodies (reduced from 10mb to 1mb for security)
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Sanitize all user input to prevent XSS
app.use(sanitizeInput);

// Health check endpoint (for monitoring and load balancers)
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

// API Routes
app.use('/api', routes);

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// Global Error Handler (MUST BE LAST)
app.use(errorHandler);

export default app;
