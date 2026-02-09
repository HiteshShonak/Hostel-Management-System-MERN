// PM2 Ecosystem Configuration for HMS Backend
// Provides cluster mode, auto-restart, and monitoring
// Run: pm2 start ecosystem.config.js

module.exports = {
    apps: [
        {
            name: 'hms-backend',
            script: 'dist/index.js',

            // Cluster mode - utilize all CPU cores
            instances: 'max', // or set to specific number like 4
            exec_mode: 'cluster',

            // Auto-restart settings
            max_memory_restart: '500M',
            autorestart: true,
            watch: false,

            // Environment variables
            env: {
                NODE_ENV: 'development',
                PORT: 5000,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5000,
            },

            // Logging
            log_file: './logs/combined.log',
            out_file: './logs/out.log',
            error_file: './logs/error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true,

            // Graceful shutdown
            kill_timeout: 5000,
            listen_timeout: 10000,
            wait_ready: true,

            // Health monitoring
            min_uptime: 10000,
            max_restarts: 10,
        },
    ],
};
