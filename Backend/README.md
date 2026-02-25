# HMS — Backend API | IIIT Sonepat

A comprehensive RESTful API for the IIIT Sonepat Hostel Management System, built with Node.js, Express, TypeScript, and MongoDB, featuring role-based authentication, push notifications, and real-time data management.

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
- Token refresh mechanism
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
- Notification preferences

### Attendance System
- Daily attendance tracking
- Real-time status updates
- Parent visibility
- Historical records
- Stats and analytics

### Complaint Management
- Category-based complaints
- Priority levels
- Status tracking (Pending/In Progress/Resolved)
- Admin resolution workflow
- Comment threads

### Notice Board
- Announcement system
- Priority-based display
- Read status tracking
- Admin management

### Emergency Services
- SOS alerts with location
- Emergency contacts management
- Instant notifications to wardens
- Location tracking

### Additional Features
- Visitor management
- Laundry tracking
- Payment history
- Profile management
- System configuration

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
│   ├── controllers/                # Business logic (16 files)
│   │   ├── auth.controller.ts      # Authentication (9KB)
│   │   ├── gatepass.controller.ts  # Gate pass system (17KB)
│   │   ├── admin.controller.ts     # Admin operations (30KB)
│   │   ├── parent.controller.ts    # Parent features (13KB)
│   │   ├── foodrating.controller.ts # Meal ratings (4KB)
│   │   ├── messmenu.controller.ts  # Menu management (4KB)
│   │   ├── attendance.controller.ts # Attendance (6KB)
│   │   ├── complaint.controller.ts # Complaints (4KB)
│   │   ├── notice.controller.ts    # Notices (4KB)
│   │   ├── notification.controller.ts # Notifications (3KB)
│   │   ├── emergency.controller.ts # Emergency SOS (3KB)
│   │   ├── visitor.controller.ts   # Visitors (3KB)
│   │   ├── payment.controller.ts   # Payments (2KB)
│   │   ├── laundry.controller.ts   # Laundry (2KB)
│   │   ├── test.controller.ts      # Testing endpoints (3KB)
│   │   └── index.ts                # Controller exports
│   │
│   ├── models/                     # MongoDB schemas (15 files)
│   │   ├── User.ts                 # User model with roles
│   │   ├── GatePass.ts             # Gate pass schema
│   │   ├── GatePassLog.ts          # Entry/exit logs
│   │   ├── ParentStudent.ts        # Parent-student links
│   │   ├── FoodRating.ts           # Meal ratings
│   │   ├── MessMenu.ts             # Weekly menu
│   │   ├── Attendance.ts           # Attendance records
│   │   ├── Complaint.ts            # Complaint system
│   │   ├── Notice.ts               # Announcements
│   │   ├── Notification.ts         # Push notifications
│   │   ├── Emergency.ts            # SOS records
│   │   ├── Visitor.ts              # Visitor management
│   │   ├── Payment.ts              # Payment history
│   │   ├── Laundry.ts              # Laundry tracking
│   │   └── SystemConfig.ts         # System settings
│   │
│   ├── routes/                     # API routes (16 files)
│   │   ├── auth.routes.ts
│   │   ├── gatepass.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── parent.routes.ts
│   │   ├── foodrating.routes.ts
│   │   ├── messmenu.routes.ts
│   │   ├── attendance.routes.ts
│   │   ├── complaint.routes.ts
│   │   ├── notice.routes.ts
│   │   ├── notification.routes.ts
│   │   ├── emergency.routes.ts
│   │   ├── visitor.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── laundry.routes.ts
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
│   │   ├── attendance.schema.ts
│   │   ├── visitor.schema.ts
│   │   ├── laundry.schema.ts
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

# Expo Push Notifications (No additional config needed)
# Push tokens are handled automatically by expo-notifications

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=false

# Allowed Origins (CORS)
ALLOWED_ORIGINS=http://localhost:8081,exp://192.168.1.1:8081

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
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
POST   /api/auth/change-password   # Change password
```

### Gate Pass
```
GET    /api/gatepass                    # Get user's gate passes
GET    /api/gatepass/current            # Get active pass
GET    /api/gatepass/:id                # Get specific pass
POST   /api/gatepass                    # Request new pass
PUT    /api/gatepass/:id/approve        # Approve pass (warden/admin)
PUT    /api/gatepass/:id/reject         # Reject pass (warden/admin)
POST   /api/gatepass/:id/verify         # Verify QR code (guard)
GET    /api/gatepass/logs               # Get entry/exit logs (guard)
```

### Parent
```
GET    /api/parent/children             # Get linked students
POST   /api/parent/link                 # Link to student
GET    /api/parent/pending-passes       # Get pending approval passes
PUT    /api/parent/passes/:id/approve   # Approve gate pass
PUT    /api/parent/passes/:id/reject    # Reject gate pass
GET    /api/parent/attendance/:studentId # Get student attendance
```

### Mess Menu & Ratings
```
GET    /api/messmenu                    # Get weekly menu
GET    /api/messmenu/:day               # Get specific day menu
PUT    /api/messmenu/:day               # Update menu (admin/mess staff)
POST   /api/messmenu/timings            # Update meal timings (admin)

POST   /api/foodrating                  # Rate a meal
GET    /api/foodrating/my               # Get my ratings
GET    /api/foodrating/stats            # Get rating statistics
```

### Complaints
```
GET    /api/complaints                  # Get user's complaints
GET    /api/complaints/:id              # Get specific complaint
POST   /api/complaints                  # Submit complaint
PUT    /api/complaints/:id/resolve      # Resolve complaint (admin)
PUT    /api/complaints/:id/status       # Update status (admin)
```

### Notices
```
GET    /api/notices                     # Get all notices
GET    /api/notices/:id                 # Get specific notice
POST   /api/notices                     # Create notice (admin)
PUT    /api/notices/:id                 # Update notice (admin)
DELETE /api/notices/:id                 # Delete notice (admin)
```

### Attendance
```
POST   /api/attendance/mark             # Mark attendance (student)
GET    /api/attendance/my               # Get my attendance
GET    /api/attendance/stats            # Get attendance stats
GET    /api/attendance/history          # Get historical records
```

### Notifications
```
GET    /api/notifications               # Get user notifications
PUT    /api/notifications/:id/read      # Mark as read
PUT    /api/notifications/read-all      # Mark all as read
GET    /api/notifications/unread-count  # Get unread count
POST   /api/notifications/token         # Save Expo push token
```

### Emergency
```
POST   /api/emergency/sos               # Send SOS alert
GET    /api/emergency/contacts          # Get emergency contacts
POST   /api/emergency/contacts          # Add contact (admin)
```

### Visitors
```
GET    /api/visitors                    # Get visitor history
POST   /api/visitors                    # Register visitor
GET    /api/visitors/pending            # Get pending approvals (guard)
PUT    /api/visitors/:id/approve        # Approve visitor (guard)
```

### Payments
```
GET    /api/payments                    # Get payment history
GET    /api/payments/dues               # Get pending dues
POST   /api/payments                    # Record payment (admin)
```

### Laundry
```
GET    /api/laundry                     # Get laundry schedule
POST   /api/laundry                     # Schedule pickup
PUT    /api/laundry/:id/status          # Update status (admin)
```

### Admin
```
GET    /api/admin/users                 # Get all users
GET    /api/admin/users/:id             # Get user details
PUT    /api/admin/users/:id/role        # Update user role
GET    /api/admin/stats                 # Get system statistics
GET    /api/admin/pending-approvals     # Get pending approvals
POST   /api/admin/config                # Update system config
```

### Testing
```
POST   /api/test/notification           # Send test push notification
POST   /api/test/email                  # Send test email
GET    /api/test/health                 # Health check
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
- `mess-staff` - Menu management

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
- Bypassed for trusted IPs (configurable)

### Push Notifications
- Expo Push API integration (HTTP-based)
- Automatic Expo push token management
- Notification queuing for offline users
- Badge count tracking
- No Firebase/FCM setup required

## 🛡️ Security Features

- **Helmet** - Secure HTTP headers
- **CORS** - Origin whitelisting
- **Rate Limiting** - DDoS protection
- **Input Validation** - Zod schemas
- **SQL Injection Prevention** - Mongoose queries
- **XSS Protection** - Input sanitization
- **JWT Expiry** - Token refresh mechanism
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

Hostel Management System — IIIT Sonepat

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Database:** MongoDB 8.9  
**Runtime:** Node.js 18+  
**Deployment:** Render.com
