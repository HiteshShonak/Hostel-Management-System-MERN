# HMS - Backend API | IIIT Sonepat

REST API for the IIIT Sonepat Hostel Management System, built with Node.js, Express, TypeScript, and MongoDB. It handles role-based access, notifications, and day-to-day hostel workflows.

## 🚀 Tech Stack

### Core Framework

- **Node.js** 18+
- **Express** 4.21
- **TypeScript** 5.9
- **MongoDB** with **Mongoose** 8.9

### Authentication & Security

- **JWT** (jsonwebtoken 9.0) - Token-based authentication
- **bcryptjs** 2.4 - Password hashing
- **Helmet** 8.1 - Security headers
- **express-rate-limit** 8.2 - API rate limiting
- **Zod** 4.3 - Input validation & sanitization

### Caching & Performance

- **Redis** via **ioredis** 5.9 - Caching layer
- **compression** 1.8 - Response compression
- **PM2** - Production process manager

### Monitoring & Logging

- **morgan** 1.10 - HTTP request logging
- Custom logger utility

### Development Tools

- **ts-node-dev** - Development server with hot reload
- **TypeScript strict mode** - Type safety
- **dotenv** - Environment configuration

## 📚 Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (Student, Parent, Guard, Warden, Admin)
- Secure password hashing
- Parent-student linking system

### Gate Pass Management

- Digital gate pass requests
- QR code generation
- Parent approval workflow
- Multi-level approvals (Student → Parent → Warden)
- Real-time pass verification
- Entry/exit logging
- Automatic pass expiry

### Mess Management

- Weekly menu system (7 days)
- Meal ratings (1-5 stars)
- Time-restricted rating windows (12 hours)
- Dynamic meal timings
- IST timezone handling
- Duplicate rating prevention

### Notification System

- Expo Push API integration
- Push notification delivery via HTTP
- In-app notification center
- Badge count management

### Complaint Management

- Category-based complaints
- Status tracking (Pending/In Progress/Resolved)
- Warden resolution workflow

### Notice Board

- Announcement system
- Priority-based display
- Staff management (warden/mess staff/admin)

### Emergency Services

- SOS alerts with location
- Emergency contacts management
- Instant notifications to wardens
- Location tracking

### Additional Features

- Parent-student linking
- System configuration (geofence, app limits)
- Emergency contact list
- Entry/exit activity logs
- Expo push notifications

## 🏗️ Project Structure

```
Backend/
├── src/
│   ├── index.ts                    # Entry point
│   ├── app.ts                      # Express app configuration
│   ├── constants.ts                # Application constants
│   │
│   ├── config/
│   │   └── db.ts                   # MongoDB connection
│   │
│   ├── controllers/                # Business logic (12 files)
│   │   ├── auth.controller.ts      # Authentication (9KB)
│   │   ├── gatepass.controller.ts  # Gate pass system (17KB)
│   │   ├── admin.controller.ts     # Admin operations (30KB)
│   │   ├── parent.controller.ts    # Parent features (13KB)
│   │   ├── foodrating.controller.ts # Meal ratings (4KB)
│   │   ├── messmenu.controller.ts  # Menu management (4KB)
│   │   ├── complaint.controller.ts # Complaints (4KB)
│   │   ├── notice.controller.ts    # Notices (4KB)
│   │   ├── notification.controller.ts # Notifications (3KB)
│   │   ├── emergency.controller.ts # Emergency SOS (3KB)
│   │   ├── test.controller.ts      # Testing endpoints (3KB)
│   │   └── index.ts                # Controller exports
│   │
│   ├── models/                     # MongoDB schemas (12 files)
│   │   ├── User.ts                 # User model with roles
│   │   ├── GatePass.ts             # Gate pass schema
│   │   ├── GatePassLog.ts          # Entry/exit logs
│   │   ├── ParentStudent.ts        # Parent-student links
│   │   ├── FoodRating.ts           # Meal ratings
│   │   ├── MessMenu.ts             # Weekly menu
│   │   ├── Complaint.ts            # Complaint system
│   │   ├── Notice.ts               # Announcements
│   │   ├── Notification.ts         # Push notifications
│   │   ├── Emergency.ts            # SOS records
│   │   └── SystemConfig.ts         # System settings
│   │
│   ├── routes/                     # API routes (12 files)
│   │   ├── auth.routes.ts
│   │   ├── gatepass.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── parent.routes.ts
│   │   ├── foodrating.routes.ts
│   │   ├── messmenu.routes.ts
│   │   ├── complaint.routes.ts
│   │   ├── notice.routes.ts
│   │   ├── notification.routes.ts
│   │   ├── emergency.routes.ts
│   │   ├── test.routes.ts
│   │   └── index.ts
│   │
│   ├── middleware/                 # Request middleware (6 files)
│   │   ├── auth.middleware.ts      # JWT verification
│   │   ├── role.middleware.ts      # Role-based access (3KB)
│   │   ├── validate.middleware.ts  # Zod validation
│   │   ├── sanitize.middleware.ts  # Input sanitization
│   │   ├── rateLimit.middleware.ts # API rate limiting (2KB)
│   │   └── error.middleware.ts     # Error handling (2KB)
│   │
│   ├── services/                   # Business services (4 files)
│   │   ├── jwt.service.ts          # Token generation/verification
│   │   ├── notification.service.ts # In-app notifications (3KB)
│   │   ├── push-notification.service.ts # Expo Push API (7KB)
│   │   └── index.ts
│   │
│   ├── utils/                      # Utility functions (9 files)
│   │   ├── ApiError.ts             # Custom error class
│   │   ├── ApiResponse.ts          # Standardized responses
│   │   ├── asyncHandler.ts         # Async error wrapper
│   │   ├── cache.ts                # Redis caching (4KB)
│   │   ├── logger.ts               # Logging utility (3KB)
│   │   ├── pagination.ts           # Pagination helper
│   │   ├── geometry.ts             # Location utilities (2KB)
│   │   ├── timezone.ts             # IST time utilities
│   │   └── index.ts
│   │
│   ├── schemas/                    # Zod validation schemas (9 files)
│   │   ├── auth.schema.ts
│   │   ├── gatepass.schema.ts
│   │   ├── complaint.schema.ts
│   │   ├── notice.schema.ts
│   │   ├── messmenu.schema.ts
│   │   └── common.schema.ts
│   │
│   ├── scripts/                    # Utility scripts (2 files)
│   │   ├── seedMessMenu.ts         # Menu data seeder
│   │   └── debugUserToken.ts       # Debug utility
│   │
│   └── types/                      # TypeScript definitions
│       └── index.ts
│
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── package.json
├── tsconfig.json                   # TypeScript config
├── ecosystem.config.js             # PM2 config
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **MongoDB** 4.4+ (local or Atlas)
- **Redis** 6+ (optional, for caching)
- **npm** or **yarn**

### Installation

```bash
# Clone repository
cd HMS-Mobile/Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
```

### Environment Configuration

Create `.env` file with:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hms
# Or use MongoDB Atlas:
# MONGODB_URI=your_mongodb_connection_string_here

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Expo Push Notifications (Expo Push API)
# Push tokens are handled by the client via /auth/push-token

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379

# Allowed Origins (CORS)
ALLOWED_ORIGINS=http://localhost:19006,http://localhost:8081
```

### Development

```bash
# Start development server (with hot reload)
npm run dev

# Server runs at http://localhost:5000
```

### Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start

# Or use PM2 for process management
npm run start:prod
```

### Database Setup

```bash
# Seed mess menu with default data
npm run seed:menu

# Force refresh menu data
npm run seed:menu:force
```

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/me                # Get current user (protected)
PUT    /api/auth/profile           # Update profile (protected)
PUT    /api/auth/password          # Change password
PUT    /api/auth/push-token        # Save Expo push token
```

### Gate Pass

```
GET    /api/gatepass                    # Get user's gate passes
GET    /api/gatepass/current            # Get active pass
POST   /api/gatepass                    # Request new pass
GET    /api/gatepass/pending            # Pending passes (warden)
GET    /api/gatepass/all                # All passes (warden)
PUT    /api/gatepass/:id/approve        # Approve pass (warden)
PUT    /api/gatepass/:id/reject         # Reject pass (warden)
POST   /api/gatepass/validate           # Verify QR code (guard/warden)
PUT    /api/gatepass/:id/exit           # Mark exit (guard/warden)
PUT    /api/gatepass/:id/entry          # Mark entry (guard/warden)
GET    /api/gatepass/students-out       # Students currently outside
GET    /api/gatepass/recent-entries     # Recent entries today
GET    /api/gatepass/logs               # Entry/exit logs
```

### Parent

```
GET    /api/parent/children                     # Get linked students
GET    /api/parent/pending-passes               # Get pending approval passes
GET    /api/parent/passes                        # Get all child passes
PUT    /api/parent/passes/:id/approve           # Approve gate pass
PUT    /api/parent/passes/:id/reject            # Reject gate pass
```

### Mess Menu & Ratings

```
GET    /api/messmenu                    # Get weekly menu
PUT    /api/messmenu/timings            # Update meal timings (mess staff)
PUT    /api/messmenu/:day               # Update day menu (mess staff)

POST   /api/food-rating                 # Rate a meal
GET    /api/food-rating/average         # Get rating averages
GET    /api/food-rating/my              # Get my ratings
GET    /api/food-rating/my-ratings      # Alias for my ratings
```

### Complaints

```
GET    /api/complaints                  # Get user's complaints
POST   /api/complaints                  # Submit complaint
GET    /api/complaints/all              # All complaints (warden)
PUT    /api/complaints/:id/resolve      # Resolve complaint (warden)
PUT    /api/complaints/:id/status       # Update status (warden)
```

### Notices

```
GET    /api/notices                     # Get all notices
POST   /api/notices                     # Create notice (staff)
PUT    /api/notices/:id                 # Update notice (staff)
DELETE /api/notices/:id                 # Delete notice (staff)
```

### Notifications

```
GET    /api/notifications               # Get user notifications
GET    /api/notifications/unread-count  # Get unread count
PUT    /api/notifications/:id/read      # Mark as read
PUT    /api/notifications/read-all      # Mark all as read
DELETE /api/notifications/:id           # Delete notification
```

### Emergency

```
POST   /api/emergency                   # Send SOS alert
POST   /api/emergency/sos               # Alias for SOS
GET    /api/emergency                   # Get emergency history
GET    /api/emergency/history           # Alias for history
GET    /api/emergency/contacts          # Get emergency contacts
GET    /api/emergency/active            # Active alerts (warden)
PUT    /api/emergency/:id/acknowledge   # Acknowledge alert (warden)
PUT    /api/emergency/:id/resolve       # Resolve alert (warden)
```

### Admin

```
GET    /api/admin/config                # Read system config
PUT    /api/admin/config                # Update system config
GET    /api/admin/system-stats          # System statistics (alias: /stats)
POST   /api/admin/link-parent           # Link parent to student
DELETE /api/admin/link-parent/:id       # Unlink parent from student
GET    /api/admin/parent-links          # List parent-student links
GET    /api/admin/users                 # Get all users
GET    /api/admin/user/:id/relations    # User relations
PUT    /api/admin/users/:id/role        # Update user role
DELETE /api/admin/users/:id             # Delete user
GET    /api/admin/gate-passes           # All gate passes
PUT    /api/admin/gate-passes/:id/approve # Force-approve pass
DELETE /api/admin/gate-passes/:id       # Cancel pass
GET    /api/admin/notices               # All notices
DELETE /api/admin/notices/:id           # Delete notice
GET    /api/admin/complaints            # All complaints
GET    /api/admin/warden/dashboard-stats # Warden dashboard stats
GET    /api/admin/warden/students       # Warden student list
GET    /api/admin/warden/students/:id   # Warden student detail
```

### Testing

```
POST   /api/test/push-to-me             # Send test push to self
POST   /api/test/push-to-students       # Send test push to students
GET    /api/test/push-status            # Push token status
```

## 🔐 Authentication Flow

### Login Process

1. User sends credentials to `/api/auth/login`
2. Server validates credentials
3. Server generates JWT token
4. Client stores token securely
5. Client includes token in `Authorization: Bearer <token>` header

### Role-Based Access

**Roles:**

- `student` - Basic features
- `parent` - Parent-specific features
- `guard` - Gate pass verification
- `warden` - Approval workflows
- `admin` - Full system access
- `mess_staff` - Menu management

**Protected Routes:**

- Use `auth` middleware for authentication
- Use `role(['admin', 'warden'])` for role-based access

## 🔧 Key Features Explained

### IST Timezone Handling

All date/time operations use IST (Indian Standard Time) via `timezone.ts` utility:

- Prevents timezone-related bugs
- Consistent across meal ratings, gate passes
- Handles midnight boundaries correctly

### Meal Rating Windows

- Opens when meal starts
- Closes 12 hours after meal start
- Prevents duplicate ratings (unique compound index)
- Day-locked validation

### Gate Pass Workflow

```
Student Request → Parent Approval → Warden Approval → QR Generated
     ↓                                                       ↓
 Notification          Notifications sent         Guard Verification
```

### Redis Caching

Caches frequently accessed data:

- Mess menu (1 hour TTL)
- System config (24 hours TTL)
- User profiles (30 minutes TTL)

### Rate Limiting

- Default: 100 requests per 15 minutes
- Stricter limits on auth endpoints

### Push Notifications

- Expo Push API integration (HTTP-based)
- Expo push token updates via `/auth/push-token`
- Badge count tracking
- No Firebase/FCM setup required

## 🛡️ Security Features

- **Helmet** - Secure HTTP headers
- **CORS** - Origin whitelisting
- **Rate Limiting** - DDoS protection
- **Input Validation** - Zod schemas
- **SQL Injection Prevention** - Mongoose queries
- **XSS Protection** - Input sanitization
- **JWT Expiry** - Token expiration handling
- **Password Hashing** - bcryptjs (salt rounds: 10)

## 📊 Error Handling

Centralized error handling via `error.middleware.ts`:

```typescript
{
  success: false,
  message: "Error description",
  statusCode: 400,
  errors: [...], // Validation errors
  stack: "..." // Only in development
}
```

## 🚀 Production Deployment

### PM2 Configuration

```bash
# Start with PM2
npm run start:prod

# View logs
npm run logs

# Reload (zero downtime)
npm run reload:prod

# Stop
npm run stop:prod
```

### Environment Checklist

- [ ] `NODE_ENV=production`
- [ ] Strong `JWT_SECRET` (min 32 chars)
- [ ] MongoDB Atlas connection string
- [ ] Redis enabled and configured
- [x] Expo Push API configured (no extra keys needed)
- [ ] CORS origins set correctly
- [ ] Rate limiting configured

### Render.com Deployment

1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Enable auto-deploy

## 📝 Development Guidelines

### Code Style

- TypeScript strict mode
- Async/await over callbacks
- Error handling with `asyncHandler`
- Standardized API responses

### Database Conventions

- Use Mongoose schemas with TypeScript
- Compound indexes for performance
- Virtual fields for computed data
- Timestamps on all models

### API Response Format

```typescript
// Success
{
  success: true,
  message: "Operation successful",
  data: {...}
}

// Error
{
  success: false,
  message: "Error message",
  statusCode: 400
}
```

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Timeout

**Solution:** Check `MONGODB_URI` and network connectivity

### Issue: JWT Token Invalid

**Solution:** Verify `JWT_SECRET` matches and token hasn't expired

### Issue: Push Notifications Not Working

**Solution:**

1. Verify Expo push token is being registered
2. Check backend logs for Expo API errors
3. Test with backend `/api/test/notification` endpoint

### Issue: Redis Connection Failed

**Solution:** Set `REDIS_ENABLED=false` to disable caching

## 📚 Scripts

```bash
npm run dev          # Development server (hot reload)
npm run build        # Build TypeScript
npm start            # Production server
npm run start:prod   # PM2 production
npm run seed:menu    # Seed menu data
npm run logs         # View PM2 logs
```

## 🤝 API Testing

Use tools like:

- **Postman** - Full API testing
- **Thunder Client** (VS Code extension)
- **curl** - Command line testing

Example:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'

# Get gate passes (with token)
curl http://localhost:5000/api/gatepass \
  -H "Authorization: Bearer your_jwt_token_here"
```

## 📄 License

[MIT License](../LICENSE) - See LICENSE file for details

## 👨‍💻 Developed By

Hostel Management System - IIIT Sonepat

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Database:** MongoDB 8.9  
**Runtime:** Node.js 18+  
**Deployment:** Render.com
