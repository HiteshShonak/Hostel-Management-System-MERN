#!/bin/bash
# MongoDB Backup Script for HMS Backend
# Schedule with cron: 0 2 * * * /path/to/backup.sh
# Requires: mongodump installed

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_NAME="hms-backup-$DATE"
MONGO_URI="${MONGO_URI:-mongodb://localhost:27017/hms}"
RETAIN_DAYS=7

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

echo "Starting MongoDB backup..."
echo "Date: $DATE"
echo "Database: $MONGO_URI"

# Create backup
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/$BACKUP_NAME"

if [ $? -eq 0 ]; then
    echo "✅ Backup created: $BACKUP_DIR/$BACKUP_NAME"
    
    # Compress backup
    tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"
    rm -rf "$BACKUP_DIR/$BACKUP_NAME"
    
    echo "✅ Backup compressed: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
    
    # Clean old backups (older than RETAIN_DAYS)
    find "$BACKUP_DIR" -name "hms-backup-*.tar.gz" -mtime +$RETAIN_DAYS -delete
    echo "✅ Old backups cleaned (>$RETAIN_DAYS days)"
else
    echo "❌ Backup failed!"
    exit 1
fi

echo "Backup completed successfully!"
