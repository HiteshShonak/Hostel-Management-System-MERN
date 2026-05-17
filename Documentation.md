# HMS - Hostel Management System | IIIT Sonepat | Project Documentation

## 📋 Project Overview

Smart Hostel is a **mobile-first** hostel management system for **Indian Institute of Information Technology, Sonepat (IIIT Sonepat)**. The app is built with React Native (Expo) for iOS and Android, with a Node.js (Express) backend. It supports students, parents, guards, wardens, and administrators in one workflow.

**Platform:** Mobile-only (iOS & Android)  
**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** Production Ready

## 📊 Project Statistics

### Frontend Summary

- **Total Screens**: 30 screens (14 core + 16 role-specific)
- **Components**: 16 reusable UI components
- **Lib Utilities**: 11 core files + hooks/utils helpers
- **Technology**: React Native 0.81.5, Expo SDK ~54, TypeScript 5.9
- **Platforms**: iOS 11.0+ & Android 5.0+ (Tested on both using Expo Go)

### Backend Summary

- **Controllers**: 12 controllers
- **Models**: 12 MongoDB schemas
- **Routes**: 12 route files
- **Middleware**: 6 middleware files
- **Technology**: Node.js 18+, Express 4.21, MongoDB 8.9, TypeScript 5.9

---

## 🏗️ Complete Project Structure

```
HMS-Mobile/
│
├── Frontend/                          # React Native Mobile App (Expo)
│   │
│   ├── app/                          # Screens - Expo Router (File-based routing)
│   │   ├── _layout.tsx              # Root layout (2.7KB) - Auth & Theme providers
│   │   ├── index.tsx                # Dashboard (43KB) - Main hub
│   │   ├── login.tsx                # Login screen (7KB)
│   │   ├── register.tsx             # Registration (16KB)
│   │   │
│   │   ├── gate-pass.tsx            # Gate pass system (28KB)
│   │   ├── mess-menu.tsx            # Mess menu + ratings (40KB)
│   │   ├── attendance.tsx           # Attendance (15KB)
│   │   ├── complaints.tsx           # Complaint system (19KB)
│   │   ├── notices.tsx              # Notice board (18KB)
│   │   ├── emergency.tsx            # Emergency SOS (16KB)
│   │   ├── profile.tsx              # User profile (14KB)
│   │   ├── food-ratings.tsx         # Meal ratings (17KB)
│   │   ├── notifications.tsx        # Notification center (9KB)
│   │   ├── settings.tsx             # App settings (11KB)
│   │   ├── qr-scanner.tsx           # QR code scanner (29KB)
│   │   │
│   │   ├── admin/                   # Admin-only screens (5 screens)
│   │   │   ├── _layout.tsx
│   │   │   ├── config.tsx           # System configuration
│   │   │   ├── link-parent.tsx      # Parent-student linking
│   │   │   ├── parent-links.tsx     # Manage all links
│   │   │   ├── stats.tsx            # System statistics
│   │   │   └── users.tsx            # User management
│   │   │
│   │   ├── parent/                  # Parent portal (5 screens)
│   │   │   ├── _layout.tsx
│   │   │   ├── children.tsx        # Linked students
│   │   │   ├── today-attendance.tsx # Real-time attendance
│   │   │   ├── pending-passes.tsx  # Pass approvals
│   │   │   ├── pass-history.tsx    # Historical passes
│   │   │   └── attendance-history.tsx # Attendance records
│   │   │
│   │   ├── guard/                   # Guard screens (3 screens)
│   │   │   ├── activity-logs.tsx   # Entry/exit logs
│   │   │   ├── recent-entries.tsx  # Recent entries
│   │   │   └── students-out.tsx    # Students outside
│   │   │
│   │   └── warden/                  # Warden screens (3 screens)
│   │       ├── _layout.tsx
│   │       ├── students.tsx        # Student list
│   │       ├── student-detail.tsx  # Student detail
│   │       └── pass-history.tsx    # Pass history
│   │
│   ├── components/                   # Reusable Components
│   │   ├── ui/                      # UI Components (10 files)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── DashboardCard.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── ThemedComponents.tsx
│   │   │
│   │   ├── dashboard/               # Dashboard Components (4 files)
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── WelcomeSection.tsx
│   │   │
│   │   └── modals/                  # Modal Components (2 files)
│   │       ├── ComplaintModal.tsx
│   │       └── TimingEditorModal.tsx
│   │
│   ├── lib/                         # Core Libraries & Utilities (11 files)
│   │   ├── api.ts                  # Axios client + interceptors (2KB)
│   │   ├── auth-context.tsx        # Auth state management (3KB)
│   │   ├── theme-context.tsx       # Dark/light theme (3KB)
│   │   ├── hooks.ts                # React Query hooks (32KB) ⭐
│   │   ├── services.ts             # API service layer (26KB) ⭐
│   │   ├── types.ts                # TypeScript definitions (6KB)
│   │   ├── utils.ts                # Helper utilities (1KB)
│   │   ├── timezone.ts             # IST time utilities ⭐
│   │   ├── notifications.ts        # Expo push setup (2KB)
│   │   ├── error-utils.ts          # Error handling (6KB)
│   │   ├── constants.ts            # App constants (1KB)
│   │   ├── hooks/                  # React Query hook helpers
│   │   └── utils/                  # Utility helpers
│   │
│   ├── assets/                      # Static Assets
│   │   └── icon.png                # App icon
│   │
│   ├── app.json                     # Expo configuration
│   ├── eas.json                     # EAS Build configuration
│   ├── package.json                 # Dependencies
│   ├── tsconfig.json                # TypeScript config
│   ├── babel.config.js              # Babel config
│   ├── metro.config.js              # Metro bundler config
│   └── README.md                    # Frontend documentation
│
├── Backend/                          # Express API Backend
│   ├── src/
│   │   │
│   │   ├── controllers/             # Business Logic (12 files)
│   │   │   ├── admin.controller.ts         # Admin ops (30KB) ⭐
│   │   │   ├── gatepass.controller.ts      # Gate passes (18KB) ⭐
│   │   │   ├── parent.controller.ts        # Parent portal (13KB) ⭐
│   │   │   ├── auth.controller.ts          # Authentication (9KB)
│   │   │   ├── attendance.controller.ts    # Attendance (6KB)
│   │   │   ├── complaint.controller.ts     # Complaints (4KB)
│   │   │   ├── messmenu.controller.ts      # Mess menu (4KB)
│   │   │   ├── notice.controller.ts        # Notices (4KB)
│   │   │   ├── foodrating.controller.ts    # Ratings (4KB)
│   │   │   ├── emergency.controller.ts     # Emergency (3KB)
│   │   │   ├── notification.controller.ts  # Notifications (3KB)
│   │   │   ├── test.controller.ts          # Testing (3KB)
│   │   │   └── index.ts                    # Exports
│   │   │
│   │   ├── models/                  # MongoDB Schemas (12 files)
│   │   │   ├── User.ts             # Users (all roles)
│   │   │   ├── GatePass.ts         # Gate passes
│   │   │   ├── GatePassLog.ts      # Entry/exit logs
│   │   │   ├── ParentStudent.ts    # Parent-student links
│   │   │   ├── FoodRating.ts       # Meal ratings
│   │   │   ├── MessMenu.ts         # Weekly menu
│   │   │   ├── Attendance.ts       # Attendance records
│   │   │   ├── Complaint.ts        # Complaints
│   │   │   ├── Notice.ts           # Announcements
│   │   │   ├── Notification.ts     # Push notifications
│   │   │   ├── Emergency.ts        # SOS alerts
│   │   │   └── SystemConfig.ts     # System settings
│   │   │
│   │   ├── routes/                  # API Routes (12 files)
│   │   │   ├── auth.routes.ts
│   │   │   ├── gatepass.routes.ts
│   │   │   ├── admin.routes.ts
│   │   │   ├── parent.routes.ts
│   │   │   ├── foodrating.routes.ts
│   │   │   ├── messmenu.routes.ts
│   │   │   ├── attendance.routes.ts
│   │   │   ├── complaint.routes.ts
│   │   │   ├── notice.routes.ts
│   │   │   ├── notification.routes.ts
│   │   │   ├── emergency.routes.ts
│   │   │   ├── test.routes.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── middleware/              # Request Processing (6 files)
│   │   │   ├── auth.middleware.ts  # JWT verification
│   │   │   ├── role.middleware.ts  # RBAC (3KB)
│   │   │   ├── error.middleware.ts # Error handler (2KB)
│   │   │   ├── validate.middleware.ts # Zod validation
│   │   │   ├── sanitize.middleware.ts # Input cleaning
│   │   │   └── rateLimit.middleware.ts # Rate limiting (2KB)
│   │   │
│   │   ├── services/                # Business Services (4 files)
│   │   │   ├── jwt.service.ts      # Token management
│   │   │   ├── notification.service.ts # In-app notifications (3KB)
│   │   │   ├── push-notification.service.ts # Expo Push API (7KB) ⭐
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                   # Utilities (9 files)
│   │   │   ├── ApiError.ts         # Custom errors
│   │   │   ├── ApiResponse.ts      # Standard responses
│   │   │   ├── asyncHandler.ts     # Async wrapper
│   │   │   ├── cache.ts            # Redis caching (4KB)
│   │   │   ├── logger.ts           # Logging (3KB)
│   │   │   ├── pagination.ts       # Pagination
│   │   │   ├── geometry.ts         # Geofencing (2KB)
│   │   │   ├── timezone.ts         # IST utilities ⭐
│   │   │   └── index.ts
│   │   │
│   │   ├── schemas/                 # Zod Validation (11 files)
│   │   │   ├── admin.schema.ts
│   │   │   ├── attendance.schema.ts
│   │   │   ├── auth.schema.ts
│   │   │   ├── complaint.schema.ts
│   │   │   ├── emergency.schema.ts
│   │   │   ├── foodrating.schema.ts
│   │   │   ├── gatepass.schema.ts
│   │   │   ├── messmenu.schema.ts
│   │   │   ├── notice.schema.ts
│   │   │   ├── parent.schema.ts
│   │   │   └── common.schema.ts
│   │   │
│   │   ├── scripts/                 # Utility Scripts (2 files)
│   │   │   ├── seedMessMenu.ts     # Menu data seeder
│   │   │   └── debugUserToken.ts   # Debug utility
│   │   │
│   │   ├── config/                  # Configuration
│   │   │   └── db.ts               # MongoDB connection
│   │   │
│   │   ├── types/                   # TypeScript Definitions
│   │   │   └── index.ts
│   │   │
│   │   ├── app.ts                   # Express app setup (2.8KB)
│   │   ├── index.ts                 # Server entry (2.4KB)
│   │   └── constants.ts             # Constants (1.2KB)
│   │
│   ├── dist/                        # Compiled JS (production)
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Template
│   ├── package.json                 # Dependencies
│   ├── tsconfig.json                # TypeScript config
│   ├── ecosystem.config.js          # PM2 config
│   └── README.md                    # Backend documentation
│
├── .git/                            # Git repository
├── .gitignore                       # Git ignore rules
├── README.md                        # Root README
└── Documentation.md                 # This file
```

---

## 🚀 Technology Stack

### Frontend Technologies

#### Core

- **React Native** 0.81.5 - Mobile framework
- **Expo SDK** ~54.0 - Development platform
- **TypeScript** 5.9 - Type safety
- **Expo Router** 6.0 - File-based routing
- **React** 19.1 - UI library

#### State & Data

- **TanStack React Query** 5.64 - Server state management ⭐
- **Axios** 1.7 - HTTP client
- **React Context** - Global state (Auth, Theme)

#### Device Features

- **expo-camera** - QR scanning, verification
- **expo-notifications** - Expo Push API notifications
- **expo-location** - Emergency location
- **expo-secure-store** - Secure token storage
- **react-native-qrcode-svg** - QR generation
- **@react-native-community/datetimepicker** - Date/time pickers

#### UI

- **@expo/vector-icons** - Ionicons
- **react-native-svg** - SVG support
- **Custom StyleSheet** - Native styling

#### Build & Deploy

- **EAS Build** - Production builds
- **EAS Update** - OTA updates
- **Expo Push API** - Push notifications

### Backend Technologies

#### Core

- **Node.js** 18+ - Runtime
- **Express** 4.21 - Web framework
- **TypeScript** 5.9 - Type safety
- **MongoDB** 8.9 with **Mongoose** - Database

#### Security

- **JWT** (jsonwebtoken 9.0) - Authentication
- **bcryptjs** 2.4 - Password hashing
- **Helmet** 8.1 - Security headers
- **express-rate-limit** 8.2 - Rate limiting
- **Zod** 4.3 - Input validation

#### Performance

- **Redis** (ioredis 5.9) - Caching layer
- **compression** 1.8 - Response compression
- **PM2** - Process management

#### Monitoring

- **morgan** 1.10 - HTTP logging
- Custom Winston-style logger

#### Development

- **ts-node-dev** - Hot reload
- **dotenv** - Environment config

---

## 🎯 Key Features

### Student Features (13)

1. **Dashboard** - Unified hub with quick actions
2. **Gate Pass** - Request passes with QR codes
3. **Mess Menu & Ratings** - Weekly menu and time-windowed ratings
4. **Attendance** - Geofence-based attendance marking
5. **Complaints** - Submit & track issues
6. **Notices** - View announcements
7. **Emergency SOS** - SOS with location + emergency contacts
8. **Food Ratings** - Rate meals (12-hour windows)
9. **Notifications** - Push + in-app
10. **Profile & Settings** - Manage account and preferences
11. **QR Scanner** - Scan passes for validation
12. **Pass History** - View past passes
13. **Attendance History** - Records

### Parent Features (6)

1. **Children Dashboard** - Linked students overview
2. **Today's Attendance** - Real-time status
3. **Attendance History** - Records
4. **Pending Passes** - Approve/reject requests
5. **Pass History** - Historical passes
6. **Notifications** - Gate pass alerts

### Guard Features (4)

1. **QR Scanner** - Verify gate passes
2. **Activity Logs** - Entry/exit history
3. **Students Outside** - Live list of students currently out
4. **Recent Entries** - Students who returned today

### Warden Features (4)

1. **Pass Management** - Approve/reject passes
2. **Pass History** - Review all gate passes
3. **Student Management** - Student list + detail view
4. **Attendance Marking** - Mark attendance for students

### Admin Features (4)

1. **User Management** - Manage users and roles
2. **Parent Linking** - Link and unlink parents to students
3. **System Config** - Geofence, attendance window, app limits
4. **System Statistics** - Users, passes, attendance, complaints, notices

---

## 📡 API Architecture

### API Endpoint Summary

**Authentication**

- Register, Login, Profile, Change Password, Push Token

**Gate Pass**

- Request, Approve/Reject, Validate, Entry/Exit, Logs, Students Out, Recent Entries

**Parent Portal**

- Children, Passes, Approvals, Attendance (today + history)

**Mess & Ratings**

- Menu, Timings, Rate Meal, Averages

**Attendance**

- Mark, Today, History, Stats

**Complaints**

- Create, List, Status Update, Resolve

**Notices**

- List, Create, Update, Delete

**Notifications**

- Get, Read, Read All, Unread Count, Delete

**Emergency**

- SOS, Contacts, Active, Acknowledge, Resolve

**Admin**

- Users, Parent Links, Config, Stats, Oversight

**Testing**

- Push tests (development only)

### API Response Format

**Success:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": [...]
}
```

---

## 🗄️ Database Architecture

### MongoDB Collections (12)

| Collection       | Purpose            | Key Fields                              |
| ---------------- | ------------------ | --------------------------------------- |
| `users`          | All user accounts  | email, password, role, name             |
| `gatepasses`     | Gate pass requests | user, status, fromDate, toDate, qrValue |
| `gatepasslogs`   | Entry/exit logs    | gatePass, type, timestamp, guard        |
| `parentstudents` | Parent-child links | parent, student, relationship, status   |
| `foodratings`    | Meal ratings       | user, mealType, rating, date            |
| `messmenus`      | Weekly menu        | day, meals, timings                     |
| `attendances`    | Attendance records | user, date, location                    |
| `complaints`     | Complaints         | user, category, status                  |
| `notices`        | Announcements      | title, urgent, source                   |
| `notifications`  | Push notifications | user, type, message, read               |
| `emergencies`    | SOS alerts         | user, type, status, location            |
| `systemconfigs`  | System settings    | geofence, attendanceWindow, appConfig   |

### Key Indexes

- `users`: email (unique), role
- `gatepasses`: student, status, createdAt
- `foodratings`: [user, mealType, date] (compound unique)
- `attendances`: [user, date] (compound unique)
- `parentstudents`: [parent, student] (compound unique)

---

## 🔐 Security Features

### Authentication

- JWT tokens with expiry (7 days)
- Secure password hashing (bcrypt, 10 rounds)
- Token stored in expo-secure-store

### Authorization

- Role-based access control (RBAC)
- Middleware: `auth`, `role(['admin', 'warden'])`
- Protected routes on frontend & backend

### Input Protection

- Zod schema validation
- Input sanitization middleware
- SQL injection prevention (Mongoose)
- XSS protection

### API Security

- Helmet - Secure HTTP headers
- CORS - Origin whitelisting
- Rate limiting - 100 req/15min
- Compression - Gzip responses

### Data Security

- Password never returned in API
- Expo push tokens stored per user
- Sensitive data in .env (gitignored)
- MongoDB connection string secured

---

## ⚡ Performance Optimizations

### Frontend

- React Query caching (5min stale time)
- Optimistic updates for UX
- Background refetching
- Image optimization
- Lazy loading components

### Backend

- Redis caching:
  - Mess menu: 1 hour TTL
  - System config: 24 hours TTL
  - User profiles: 30 minutes TTL
- Database indexing on queries
- Pagination (all list endpoints)
- Connection pooling
- Graceful Redis fallback

### Build

- TypeScript compilation
- Metro bundler optimization
- APK size optimization
- Tree shaking

---

## 🚀 Deployment

### Frontend Deployment

**Platform:** EAS Build (Expo Application Services)

**Build Profiles:**

- `development` - Development builds
- `preview` - Testing APKs
- `production` - Production APKs/AABs

**OTA Updates:**

- Enabled via EAS Update
- Channels: development, preview, production
- Automatic update checks

**Build Commands:**

```bash
# Preview build
eas build --platform android --profile preview

# Production build
eas build --platform android --profile production --clear-cache

# OTA update
eas update --branch preview
```

### Backend Deployment

**Platform:** Render.com

**Environment:**

- Node.js 18+ runtime
- MongoDB Atlas database
- Redis Cloud caching
- PM2 process manager

**Deployment:**

- Auto-deploy from GitHub
- Build: `npm install`
- Start: `npm start`
- Health checks enabled

---

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- MongoDB 5+
- Redis 6+ (optional)
- Expo CLI
- Android Studio / Xcode

### Installation

**Backend:**

```bash
cd Backend
npm install
cp .env.example .env
# Edit .env with your config
npm run dev
```

**Frontend:**

```bash
cd Frontend
npm install
npx expo start
```

### Environment Variables

**Backend (.env):**

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hms
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=http://localhost:19006,http://localhost:8081
```

**Frontend (.env):**

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🎨 Special Features Deep Dive

### Meal Rating System

- **Time Windows:** Opens when meal starts, closes 12 hours later
- **IST Timezone:** Custom utilities prevent timezone bugs
- **Duplicate Prevention:** Compound unique index [user, mealType, date]
- **Day Locking:** Validation day locked at request start
- **Dynamic Timing:** Admin can modify meal timings
- **Rating Banner:** Shows countdown to opening/closing

### Gate Pass Workflow

```
Student Request
    ↓
Parent Approval (if linked)
    ↓
Warden Approval
    ↓
QR Code Generated
    ↓
Guard Scans (Entry/Exit)
    ↓
Activity Logged
```

**Features:**

- Multi-level approvals
- Real-time status updates
- QR code security
- Automatic expiry
- Entry/exit logging
- Parent notifications

### Push Notifications

- **Expo Push API:** Expo-hosted push delivery
- **Tokens:** Stored per user via `/auth/push-token`
- **Badge Counts:** Real-time unread tracking
- **Types:** Gate pass, announcements, emergency
- **Platform:** Android and iOS

### IST Timezone Handling

- **Custom Utilities:** `getISTTime()`, `getISTDate()`
- **Prevents Bugs:** Midnight boundaries, day transitions
- **Used In:** Meal ratings, attendance, gate passes
- **Format:** UTC → IST conversion

---

## 📱 Supported Platforms

- ✅ **Android** 5.0+ (API 21+) - Fully tested
- ✅ **iOS** 11.0+ - Fully tested
- 📱 **Mobile-only application** - Not designed for web

**Testing:** Verified on both Android and iOS using Expo Go during development.

---

## 🔄 Continuous Development

### Scripts

**Frontend:**

```bash
npm start              # Dev server
npm run android        # Android dev
eas build ...         # Build APK
eas update ...        # OTA update
```

**Backend:**

```bash
npm run dev           # Dev server (hot reload)
npm run build         # Compile TypeScript
npm start             # Production server
npm run start:prod    # PM2 production
npm run seed:menu     # Seed mess menu
npm run logs          # View PM2 logs
```

---

## 📊 Project Metrics

### Code Quality

- TypeScript strict mode
- Consistent code style
- Error handling patterns
- API response standards

### Test Coverage

- Manual testing on Android
- API endpoint verification
- Role-based access testing
- Security audit completed

### Performance

- API response time: <500ms
- App launch time: <3s
- Build size: ~40MB (APK)
- Database queries optimized

---

## 🎯 Future Enhancements

1. **Real-time Features** - WebSockets for live updates
2. **Analytics Dashboard** - Visual charts & insights
3. **SMS Notifications** - Parent SMS alerts
4. **Biometric Auth** - Fingerprint/Face ID
5. **Offline Mode** - Local data persistence
6. **Multi-language** - i18n support
7. **Payment Gateway** - Online fee payment
8. **Medical Records** - Health tracking
9. **Event Calendar** - Hostel events
10. **Chat System** - Messaging

---

## 📄 License

[MIT License](LICENSE) - See LICENSE file for details

---

## 👨‍💻 Development Team

Hostel Management System - IIIT Sonepat  
Built with React Native + Node.js

---

**Documentation Version:** 2.1  
**Last Updated:** February 24, 2026  
**Institution:** Indian Institute of Information Technology, Sonepat  
**Project Status:** Production Ready 🚀
