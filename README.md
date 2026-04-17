<div align="center">

# 🏨 HMS - Hostel Management System

### IIIT Sonepat

_A mobile platform for day-to-day hostel operations_

[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo SDK](https://img.shields.io/badge/Expo_SDK-54.0-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-F7DF1E?style=flat-square)](LICENSE)

<br/>

[![Live API](https://img.shields.io/badge/🌐_Live_Backend-Render-46E3B7?style=for-the-badge)](https://hostel-management-system-backend-jde3.onrender.com)
&nbsp;&nbsp;
[![Download APK](https://img.shields.io/badge/📲_Download_APK-Preview_Build_v1.0-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://drive.google.com/file/d/1qd2N3z_puIUvb0FmkYBWMVlB6mTDZXH_/view?usp=sharing)

<br/>

> Built with ❤️ for **Indian Institute of Information Technology, Sonepat**
> featuring QR gate passes, GPS attendance, mess management, emergency SOS & real-time notifications.

</div>

---

## 📱 Features

### For Students

- 🎫 **Digital Gate Passes** - Request, track, and validate passes with QR codes
- 📍 **Smart Attendance** - Geofence-based attendance marking (7 PM - 8 PM)
- 🍽️ **Mess Menu** - Weekly menu with ratings and feedback
- 📢 **Notice Board** - Real-time notices from hostel admin
- 🛠️ **Complaints** - Submit and track maintenance requests
- 👥 **Visitor Management** - Pre-register visitors
- 🔔 **Push Notifications** - Real-time alerts and updates

### For Parents

- 👨‍👩‍👧 **Child Monitoring** - View linked student activities
- ✅ **Gate Pass Approval** - Two-tier approval (Parent → Warden)
- 📊 **Attendance Tracking** - Daily attendance reports
- 🚨 **Emergency Alerts** - Instant notifications

### For Guards

- 📷 **QR Scanner** - Validate gate passes quickly
- 📝 **Activity Logs** - Entry/exit tracking
- 👥 **Real-time Dashboard** - Current pass status

### For Wardens

- 📊 **Dashboard** - Hostel statistics at a glance
- ✓ **Pass Management** - Approve/reject gate passes
- 📋 **Student Management** - View student records
- 📢 **Notice Creation** - Broadcast announcements

### For Admins

- 👥 **User Management** - Create and manage all user types
- 🔗 **Parent-Student Linking** - Link parent accounts
- ⚙️ **System Configuration** - Geofence, attendance windows
- 📈 **Analytics** - System-wide insights

---

## 🏗️ Architecture

### Frontend (Mobile App)

```
Technology Stack:
├── React Native 0.81.5
├── Expo SDK 54
├── Expo Router (File-based routing)
├── TypeScript 5.9
├── TanStack Query (State management)
├── Axios (HTTP client)
└── Expo Secure Store (Token storage)

Key Features:
├── QR Code generation/scanning (expo-barcode-scanner)
├── Geolocation (expo-location)
├── Push notifications (expo-notifications)
├── Dark/Light theme toggle
└── Offline-first with React Query caching
```

### Backend (API Server)

```
Technology Stack:
├── Node.js 18+
├── Express 4.21
├── MongoDB (Mongoose 8.9)
├── Redis (ioredis) - Caching
├── TypeScript 5.9
├── JWT (jsonwebtoken)
└── PM2 (Process management)

Security:
├── Helmet (HTTP headers)
├── CORS (Origin whitelisting)
├── Rate limiting (express-rate-limit)
├── Input sanitization
├── bcrypt (Password hashing)
├── Expo Push Notifications
└── Zod (Schema validation)
```

---

## 📂 Project Structure

```
HMS-Mobile/
│
├── Frontend/              # React Native Mobile App
│   ├── app/              # Expo Router screens
│   │   ├── (tabs)/      # Main tab navigation
│   │   ├── guard/       # Guard-specific screens
│   │   ├── parent/      # Parent portal
│   │   └── warden/      # Warden dashboard
│   ├── components/       # Reusable UI components
│   ├── lib/             # Core utilities
│   │   ├── api.ts       # Axios instance
│   │   ├── hooks.ts     # React Query hooks
│   │   ├── services.ts  # API service layer
│   │   └── types.ts     # TypeScript types
│   ├── app.json         # Expo configuration
│   ├── eas.json         # EAS Build configuration
│   └── package.json
│
├── Backend/              # Express API Server
│   ├── src/
│   │   ├── controllers/ # Request handlers (14 files)
│   │   ├── models/      # MongoDB schemas (15 collections)
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth, validation, error handling
│   │   ├── services/    # Business logic (JWT, notifications)
│   │   ├── utils/       # Helpers (logger, cache, pagination)
│   │   ├── schemas/     # Zod validation schemas
│   │   └── types/       # TypeScript interfaces
│   ├── dist/            # Compiled JavaScript (production)
│   ├── ecosystem.config.js  # PM2 configuration
│   ├── .env             # Environment variables
│   └── package.json
│
└── Documentation.md      # Detailed project documentation
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 5+ (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Redis** 6+ (Optional but recommended)
- **Git** ([Download](https://git-scm.com/))
- **Expo CLI** (will be installed automatically)

### Backend Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd HMS-Mobile/Backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your values:
#   - MONGODB_URI (your MongoDB connection)
#   - JWT_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
#   - REDIS_URL (if using Redis)

# 4. Run development server
npm run dev

# Server starts at http://localhost:5000
# Health check: http://localhost:5000/health
```

### Frontend Setup

```bash
# 1. Navigate to frontend
cd ../Frontend

# 2. Install dependencies
npm install

# 3. Configure API URL
# Edit .env file:
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000/api
# Note: Use your computer's local IP (not localhost) for physical device testing

# 4. Start Expo
npx expo start

# Options:
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator (Mac only)
# - Scan QR code with Expo Go app on your phone
```

---

## 🔧 Environment Variables

### Backend `.env`

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/hms
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your-super-secret-key-CHANGE-THIS
JWT_EXPIRES_IN=7d

# Redis (optional)
REDIS_URL=redis://localhost:6379

# CORS (production domains)
ALLOWED_ORIGINS=https://yourdomain.com
```

### Frontend `.env`

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://192.168.1.33:5000/api

# For production:
# EXPO_PUBLIC_API_URL=https://your-backend-domain.com/api
```

---

## 📦 Building for Production

### Android APK

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Build APK
cd Frontend
eas build --platform android --profile preview

# Wait 15-20 minutes -> Download APK -> Share with users
```

### iOS IPA (Requires Mac + Apple Developer Account)

```bash
# Build for TestFlight
cd Frontend
eas build --platform ios --profile preview

# Submit to App Store
eas submit --platform ios
```

### Backend Deployment (Render)

**Already deployed at:** `https://hostel-management-system-backend-jde3.onrender.com`

**To deploy your own:**

1. Create account at [render.com](https://render.com)
2. Connect GitHub repository
3. Add environment variables
4. Deploy with one click

---

## 🧪 Testing

### Backend Tests

```bash
cd Backend
npm test          # Run all tests
npm run test:watch # Watch mode
```

### API Testing

```bash
# Health Check
curl https://hostel-management-system-backend-jde3.onrender.com/health

# Login
curl -X POST https://your-backend/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"password123"}'
```

---

## 📊 Project Statistics

| Component    | Files             | Lines of Code                |
| ------------ | ----------------- | ---------------------------- |
| **Frontend** | ~5,206 lines      | React Native, TypeScript     |
| **Backend**  | ~5,755 lines      | Node.js, Express, TypeScript |
| **Total**    | **~10,961 lines** | Production code              |

### Database Collections (15 total)

- `users` - All user accounts (students, parents, staff)
- `gatepasses` - Gate pass requests
- `gatepasslogs` - Entry/exit activity
- `attendance` - Daily attendance records
- `notices` - Notice board posts
- `complaints` - Maintenance complaints
- `messmenus` - Weekly meal schedules
- `foodratings` - Meal ratings
- `visitors` - Visitor registrations
- `payments` - Fee tracking
- `laundries` - Laundry service
- `emergencies` - SOS alerts
- `notifications` - In-app notifications
- `parentstudents` - Parent-child links
- `systemconfigs` - System settings

---

## 🔒 Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcrypt with salt rounds  
✅ **Role-Based Access Control** - Student, Parent, Guard, Warden, Admin  
✅ **Rate Limiting** - Protect against brute force (3 tiers)  
✅ **Input Validation** - Zod schemas for all endpoints  
✅ **XSS Protection** - Input sanitization middleware  
✅ **CORS Whitelisting** - Configurable allowed origins  
✅ **Helmet Security** - HTTP headers hardening  
✅ **Geofencing** - Location-based attendance verification  
✅ **QR Code Security** - Unique codes for gate pass validation

---

## 🌟 Key Highlights

- ✅ **Mobile-First Design** - Optimized for students on the go
- ✅ **Real-Time Updates** - Push notifications for instant alerts
- ✅ **Offline Support** - React Query caching for offline access
- ✅ **Dark Mode** - System-aware theme switching
- ✅ **Production-Ready** - PM2 cluster mode, Redis caching, structured logging
- ✅ **Type-Safe** - Full TypeScript on frontend and backend
- ✅ **Scalable Architecture** - Supports 1000+ concurrent users

---

## 📚 Documentation

- **[Documentation.md](Documentation.md)** - Full project breakdown
- **[Backend API Documentation](Backend/API_DOCUMENTATION.md)** - API endpoints reference
- **[Deployment Guide](deployment_guide.md)** - Production deployment steps
- **[Build Testing Guide](build_testing_guide.md)** - APK/IPA build instructions

---

## 🛠️ Development

### Running Locally

```bash
# Terminal 1 - Backend
cd Backend
npm run dev
# Server at http://localhost:5000

# Terminal 2 - Frontend
cd Frontend
npx expo start
# Scan QR with Expo Go app
```

### Code Quality

```bash
# Backend build check
cd Backend
npm run build

# TypeScript check
npx tsc --noEmit
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

Developed at **Indian Institute of Information Technology, Sonepat (IIIT Sonepat)**

---

## 🆘 Support

For issues or questions:

- Check [Documentation.md](Documentation.md)
- Review API docs
- Open an issue on the GitHub repository
- Contact the team at IIIT Sonepat

---

## 🎯 Roadmap

- [ ] WebSocket for live updates
- [ ] Analytics dashboard
- [ ] SMS notifications for parents
- [ ] Biometric authentication
- [ ] Offline mode sync
- [ ] Multi-language support
- [ ] Payment gateway integration
- [ ] Medical records module
- [ ] Event calendar
- [ ] Chat system (Student ↔ Warden)

---

**Built with ❤️ at IIIT Sonepat for smarter hostel management**
