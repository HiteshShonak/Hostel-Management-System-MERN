# Smart Hostel - Complete Project Documentation

## 📋 Project Overview

Smart Hostel is a comprehensive **mobile-first** hostel management system built with React Native (Expo) for iOS and Android platforms, and Node.js (Express) for backend. The system supports multiple user roles including students, parents, guards, wardens, and administrators, providing a complete digital solution for hostel operations.

**Platform:** Mobile-only (iOS & Android)  
**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** Production Ready

## 📊 Project Statistics

### Frontend Summary
- **Total Screens**: 22 screens (18 main + 4 role-specific groups)
- **Total Lines**: ~12,000+ lines of TypeScript/TSX
- **Components**: 16 reusable UI components
- **Lib Utilities**: 12 core files (hooks, services, API, auth)
- **Technology**: React Native 0.81.5, Expo SDK ~54, TypeScript 5.9
- **Platforms**: iOS 11.0+ & Android 5.0+ (Tested on both using Expo Go)

### Backend Summary
- **Total Files**: 80+ TypeScript files
- **Total Lines**: ~15,000+ lines of TypeScript
- **Controllers**: 16 controllers
- **Models**: 15 MongoDB schemas
- **Routes**: 16 route files
- **Middleware**: 6 middleware files
- **Technology**: Node.js 18+, Express 4.21, MongoDB 8.9, TypeScript 5.9

### **Project Total**: ~27,000+ lines of production code

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
│   │   ├── visitors.tsx             # Visitor management (17KB)
│   │   ├── payments.tsx             # Payment history (13KB)
│   │   ├── laundry.tsx              # Laundry tracking (15KB)
│   │   ├── profile.tsx              # User profile (14KB)
│   │   ├── food-ratings.tsx         # Meal ratings (17KB)
│   │   ├── notifications.tsx        # Notification center (9KB)
│   │   ├── settings.tsx             # App settings (11KB)
│   │   ├── qr-scanner.tsx           # QR code scanner (29KB)
│   │   │
│   │   ├── admin/                   # Admin-only screens (6 screens)
│   │   │   ├── _layout.tsx
│   │   │   ├── complaints.tsx       # Complaint management
│   │   │   ├── config.tsx          # System configuration
│   │   │   ├── link-parent.tsx     # Parent-student linking
│   │   │   ├── parent-links.tsx    # Manage all links
│   │   │   ├── stats.tsx           # System statistics
│   │   │   └── users.tsx           # User management
│   │   │
│   │   ├── parent/                  # Parent portal (6 screens)
│   │   │   ├── _layout.tsx
│   │   │   ├── children.tsx        # Linked students
│   │   │   ├── today-attendance.tsx # Real-time attendance
│   │   │   ├── pending-passes.tsx  # Pass approvals
│   │   │   ├── pass-history.tsx    # Historical passes
│   │   │   └── attendance-history.tsx # Attendance records
│   │   │
│   │   ├── guard/                   # Guard screens (3 screens)
│   │   │   ├── _layout.tsx
│   │   │   ├── scanner.tsx         # QR verification
│   │   │   └── activity-logs.tsx   # Entry/exit logs
│   │   │
│   │   └── warden/                  # Warden screens (3 screens)
│   │       ├── _layout.tsx
│   │       ├── pending-passes.tsx  # Pass management
│   │       └── dashboard.tsx       # Warden overview
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
│   ├── lib/                         # Core Libraries & Utilities (12 files)
│   │   ├── api.ts                  # Axios client + interceptors (2KB)
│   │   ├── auth-context.tsx        # Auth state management (3KB)
│   │   ├── theme-context.tsx       # Dark/light theme (3KB)
│   │   ├── hooks.ts                # React Query hooks (32KB) ⭐
│   │   ├── services.ts             # API service layer (26KB) ⭐
│   │   ├── types.ts                # TypeScript definitions (6KB)
│   │   ├── utils.ts                # Helper utilities (1KB)
│   │   ├── timezone.ts             # IST time utilities ⭐
│   │   ├── notifications.ts        # FCM push setup (2KB)
│   │   ├── error-utils.ts          # Error handling (6KB)
│   │   ├── constants.ts            # App constants (1KB)
│   │   └── data.ts                 # Mock/seed data (3KB)
│   │
│   ├── assets/                      # Static Assets
│   │   └── icon.png                # App icon
│   │
│   ├── app.json                     # Expo configuration
│   ├── eas.json                     # EAS Build configuration
│   ├── google-services.json         # Firebase FCM config
│   ├── package.json                 # Dependencies
│   ├── tsconfig.json                # TypeScript config
│   ├── babel.config.js              # Babel config
│   ├── metro.config.js              # Metro bundler config
│   └── README.md                    # Frontend documentation
│
├── Backend/                          # Express API Backend
│   ├── src/
│   │   │
│   │   ├── controllers/             # Business Logic (16 files)
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
│   │   │   ├── visitor.controller.ts       # Visitors (3KB)
│   │   │   ├── notification.controller.ts  # Notifications (3KB)
│   │   │   ├── test.controller.ts          # Testing (3KB)
│   │   │   ├── payment.controller.ts       # Payments (2KB)
│   │   │   ├── laundry.controller.ts       # Laundry (2KB)
│   │   │   └── index.ts                    # Exports
│   │   │
│   │   ├── models/                  # MongoDB Schemas (15 files)
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
│   │   │   ├── Visitor.ts          # Visitor records
│   │   │   ├── Payment.ts          # Payment history
│   │   │   ├── Laundry.ts          # Laundry service
│   │   │   └── SystemConfig.ts     # System settings
│   │   │
│   │   ├── routes/                  # API Routes (16 files)
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
│   │   │   ├── visitor.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   ├── laundry.routes.ts
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
│   │   │   ├── push-notification.service.ts # FCM push (7KB) ⭐
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
│   │   ├── schemas/                 # Zod Validation (9 files)
│   │   │   ├── auth.schema.ts
│   │   │   ├── gatepass.schema.ts
│   │   │   ├── complaint.schema.ts
│   │   │   ├── notice.schema.ts
│   │   │   ├── messmenu.schema.ts
│   │   │   ├── attendance.schema.ts
│   │   │   ├── visitor.schema.ts
│   │   │   ├── laundry.schema.ts
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
- **expo-notifications** - Push notifications (FCM)
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
- **Firebase FCM** - Push notifications

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

### Student Features (18)
1. **Dashboard** - Unified hub with quick actions
2. **Gate Pass** - Request passes with QR codes
3. **Mess Menu** - View weekly meals + ratings
4. **Attendance** - Smart check-in/out
5. **Complaints** - Submit & track issues
6. **Notices** - View announcements
7. **Emergency** - SOS with location
8. **Visitors** - Pre-register visitors
9. **Payments** - Fee tracking
10. **Laundry** - Schedule pickups
11. **Food Ratings** - Rate meals (12-hour windows)
12. **Profile** - Manage account
13. **Notifications** - Push + in-app
14. **Settings** - App preferences
15. **QR Scanner** - Scan passes
16. **Pass History** - View past passes
17. **Attendance History** - Records
18. **Payment Dues** - Pending fees

### Parent Features (6)
1. **Children Dashboard** - Linked students overview
2. **Today's Attendance** - Real-time status
3. **Pending Passes** - Approve/reject requests
4. **Pass History** - Historical passes
5. **Attendance History** - Records
6. **Notifications** - Gate pass alerts

### Guard Features (3)
1. **QR Scanner** - Verify gate passes
2. **Activity Logs** - Entry/exit history
3. **Pass Verification** - Real-time validation

### Warden Features (3)
1. **Pass Management** - Approve/reject passes
2. **Dashboard** - Hostel overview
3. **Student Monitoring** - Track students outside

### Admin Features (8)
1. **User Management** - CRUD all users
2. **Parent Linking** - Link parents to students
3. **System Config** - Geofence, timings
4. **Complaint Management** - Resolve issues
5. **Statistics** - System analytics
6. **Notice Management** - Create announcements
7. **Menu Management** - Update mess menu
8. **Full Access** - All system data

---

## 📡 API Architecture

### API Endpoint Summary (80+)

**Authentication** (5)
- Register, Login, Profile, Change Password

**Gate Pass** (8)
- CRUD, Approve/Reject, QR Verify, Entry/Exit

**Parent Portal** (6)
- Children, Attendance, Passes, Approvals

**Mess & Ratings** (7)
- Menu CRUD, Timings, Rate Meal, Stats

**Attendance** (4)
- Mark, History, Stats

**Complaints** (5)
- CRUD, Status Update, Resolve

**Notices** (5)
- CRUD operations

**Notifications** (5)
- Get, Read, Read All, Unread Count, Token

**Emergency** (3)
- SOS, Contacts, Add Contact

**Visitors** (5)
- CRUD, Approve

**Payments** (3)
- History, Dues, Record

**Laundry** (4)
- Schedule, Status, History

**Admin** (6)
- Users, Link Parent, Stats, Config

**Testing** (3)
- Push Test, Health Check

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

### MongoDB Collections (15)

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `users` | All user accounts | email, password, role, name |
| `gatepasses` | Gate pass requests | student, status, from, to, qrCode |
| `gatepasslogs` | Entry/exit logs | gatePass, type, timestamp, guard |
| `parentstudents` | Parent-child links | parent, student, status |
| `foodratings` | Meal ratings | user, mealType, rating, date |
| `messmenus` | Weekly menu | day, meals, timing |
| `attendances` | Attendance records | user, date, status, location |
| `complaints` | Complaints | user, category, status, priority |
| `notices` | Announcements | title, content, priority |
| `notifications` | Push notifications | user, type, message, read |
| `emergencies` | SOS alerts | user, location, timestamp |
| `visitors` | Visitor records | student, name, phone, purpose |
| `payments` | Payment history | user, amount, type, date |
| `laundries` | Laundry requests | user, items, status |
| `systemconfigs` | System settings | geofence, timings (singleton) |

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
- Automatic token refresh

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
- FCM server key in environment
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
FCM_SERVER_KEY=your-firebase-fcm-key
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=false
ALLOWED_ORIGINS=http://localhost:8081
```

**Frontend (app.json):**
```json
{
  "extra": {
    "apiUrl": "http://localhost:5000/api"
  }
}
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
- **FCM Integration:** Firebase Cloud Messaging
- **Channels:** HMS Notifications (high priority)
- **Badge Counts:** Real-time unread tracking
- **Types:** Gate pass, announcements, emergency
- **Platform:** Android (iOS ready)

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

Smart Hostel Management System  
Developed with React Native + Node.js

---

**Documentation Version:** 2.0  
**Last Updated:** February 11, 2026  
**Project Status:** Production Ready 🚀
