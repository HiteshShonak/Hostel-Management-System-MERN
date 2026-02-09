@echo off
REM MongoDB Backup Script for Windows
REM Schedule with Task Scheduler
REM Requires: mongodump.exe in PATH

SET BACKUP_DIR=.\backups
SET DATE=%date:~10,4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%
SET DATE=%DATE: =0%
SET BACKUP_NAME=hms-backup-%DATE%

REM Get MongoDB URI from environment or use default
IF "%MONGO_URI%"=="" SET MONGO_URI=mongodb://localhost:27017/hms

REM Create backup directory
IF NOT EXIST "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo Starting MongoDB backup...
echo Date: %DATE%
echo Database: %MONGO_URI%

REM Create backup
mongodump --uri="%MONGO_URI%" --out="%BACKUP_DIR%\%BACKUP_NAME%"

IF %ERRORLEVEL% EQU 0 (
    echo Backup created: %BACKUP_DIR%\%BACKUP_NAME%
    echo Done!
) ELSE (
    echo Backup failed!
    exit /b 1
)
