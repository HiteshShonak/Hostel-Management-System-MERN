# Smart Hostel - Mobile App

A comprehensive **mobile-first** hostel management system built with React Native and Expo for iOS and Android, featuring role-based access for students, parents, guards, wardens, and administrators.

## 🚀 Tech Stack

### Core Framework
- **React Native** 0.81.5
- **Expo SDK** ~54.0
- **TypeScript** 5.9
- **Expo Router** 6.0 - File-based routing
- **React** 19.1

### State Management & Data Fetching
- **TanStack React Query** 5.64 - Server state management
- **Axios** 1.7 - HTTP client
- **React Context** - Auth & theme management

### UI & Styling
- **@expo/vector-icons** - Icon library (Ionicons)
- **React Native SVG** - SVG support for QR codes
- **Custom styling** - Native StyleSheet

### Device Features
- **expo-camera** - QR code scanning, attendance verification
- **expo-notifications** - Push notifications with FCM
- **expo-location** - Emergency location services
- **expo-secure-store** - Secure token storage
- **@react-native-community/datetimepicker** - Date/time pickers
- **react-native-qrcode-svg** - QR code generation

### Build & Deployment
- **EAS Build** - Production APK builds
- **EAS Updates** - OTA updates
- **Firebase Cloud Messaging** - Push notifications

## 📱 Supported Platforms

- ✅ **Android** 5.0+ (API 21+) - Fully tested
- ✅ **iOS** 11.0+ - Fully tested
- 📱 **Mobile-only application** - Not designed for web

**Testing:** Verified on both Android and iOS using Expo Go during development. Production builds tested on physical devices.

## 📱 Features

### Student Features
- **Dashboard** - Quick access to all services
- **Gate Pass** - Request and manage digital gate passes with QR codes
- **Mess Menu** - View weekly menu and rate meals (time-restricted)
- **Attendance** - Smart attendance tracking
- **Complaints** - Submit and track complaints with categories
- **Notices** - View hostel announcements
- **Emergency** - Quick SOS with location sharing
- **Visitors** - Register visitor requests
- **Payments** - View payment history
- **Laundry** - Track laundry service
- **Food Ratings** - Rate meals within 12-hour windows
- **Profile** - Manage personal information
- **Notifications** - Real-time push notifications

### Parent Features
- **Children Dashboard** - View linked student's information
- **Today's Attendance** - Real-time attendance status
- **Pending Passes** - Approve/reject gate pass requests
- **Linked Students** - Manage parent-student connections
- **Pass History** - View past gate passes
- **Notifications** - Alerts for gate pass requests

### Guard Features
- **QR Scanner** - Verify gate passes
- **Activity Logs** - View entry/exit history
- **Pass Verification** - Real-time pass validation

### Warden Features
- **Pass Management** - Approve/reject gate passes
- **Dashboard** - Overview of pending requests
- **Student Monitoring** - Track students currently outside

### Admin Features
- **Complaint Management** - Review and resolve complaints
- **Notice Management** - Create and manage announcements
- **Menu Management** - Update mess menu
- **User Management** - Manage all users
- **System Reports** - Analytics and insights
- **Approval Workflows** - Multi-level approvals

## 🏗️ Project Structure

```
Frontend/
├── app/                          # Screens (Expo Router)
│   ├── _layout.tsx              # Root layout with auth
│   ├── index.tsx                # Dashboard (42KB - main hub)
│   ├── login.tsx                # Authentication
│   ├── register.tsx             # User registration
│   │
│   ├── gate-pass.tsx            # Gate pass management (28KB)
│   ├── mess-menu.tsx            # Mess menu with ratings (39KB)
│   ├── attendance.tsx           # Attendance tracking (15KB)
│   ├── complaints.tsx           # Complaint system (19KB)
│   ├── notices.tsx              # Notice board (18KB)
│   ├── emergency.tsx            # Emergency SOS (16KB)
│   ├── visitors.tsx             # Visitor management (17KB)
│   ├── payments.tsx             # Payment history (13KB)
│   ├── laundry.tsx              # Laundry tracking (15KB)
│   ├── profile.tsx              # User profile (14KB)
│   ├── food-ratings.tsx         # Meal ratings (17KB)
│   ├── notifications.tsx        # Notification center (9KB)
│   ├── settings.tsx             # App settings (11KB)
│   ├── qr-scanner.tsx           # QR code scanner (29KB)
│   │
│   ├── admin/                   # Admin-only screens
│   │   ├── complaints.tsx       # Complaint management
│   │   ├── menu.tsx            # Menu editor
│   │   ├── notices.tsx         # Notice management
│   │   ├── reports.tsx         # System reports
│   │   ├── users.tsx           # User management
│   │   └── pending-passes.tsx  # Pass approvals
│   │
│   ├── parent/                  # Parent-only screens
│   │   ├── children.tsx        # Linked students
│   │   ├── today-attendance.tsx # Real-time attendance
│   │   ├── pending-passes.tsx  # Pass approvals
│   │   └── pass-history.tsx    # Historical passes
│   │
│   ├── guard/                   # Guard-only screens
│   │   ├── scanner.tsx         # QR verification
│   │   └── activity-logs.tsx   # Entry/exit logs
│   │
│   └── warden/                  # Warden-only screens
│       ├── pending-passes.tsx  # Pass management
│       └── dashboard.tsx       # Warden overview
│
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Tabs.tsx
│   │   └── ... (10 components)
│   │
│   ├── dashboard/               # Dashboard components
│   │   ├── QuickActions.tsx
│   │   ├── StatsCard.tsx
│   │   └── FeatureCard.tsx
│   │
│   └── modals/                  # Modal components
│       ├── ComplaintModal.tsx
│       └── TimingEditorModal.tsx
│
├── lib/                         # Utilities & services
│   ├── api.ts                  # API client setup
│   ├── auth-context.tsx        # Authentication context
│   ├── theme-context.tsx       # Dark/light theme
│   ├── hooks.ts                # Custom React Query hooks (32KB)
│   ├── services.ts             # API service functions (26KB)
│   ├── types.ts                # TypeScript definitions (6KB)
│   ├── utils.ts                # Helper functions
│   ├── timezone.ts             # IST time utilities
│   ├── notifications.ts        # Push notification setup
│   ├── error-utils.ts          # Error handling (6KB)
│   ├── constants.ts            # App constants
│   └── data.ts                 # Mock/seed data
│
├── assets/                      # Static assets
│   └── icon.png                # App icon
│
├── app.json                     # Expo configuration
├── eas.json                     # EAS build configuration
├── google-services.json         # Firebase FCM config
├── package.json                 # Dependencies
└── tsconfig.json               # TypeScript config
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18 or higher
- **npm** or **yarn**
- **Expo CLI** (installed via npx)
- **Android device** or emulator for testing

### Installation

```bash
# Clone the repository
cd HMS-Mobile/Frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your backend URL
# API_URL=http://your_backend_url_here/api
```

### Development

```bash
# Start development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Clear cache if needed
npx expo start --clear
```

### Testing with Expo Go

1. Install **Expo Go** from Play Store/App Store
2. Scan QR code from terminal
3. **Note:** Push notifications won't work in Expo Go (need development build)

### Building Production APK

```bash
# Build preview APK (for testing)
npx eas build --platform android --profile preview

# Build production APK
npx eas build --platform android --profile production --clear-cache

# Download APK from EAS dashboard
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```env
API_URL=http://your_backend_url_here/api
```

### Firebase Setup (Push Notifications)

1. Download `google-services.json` from Firebase Console
2. Place in `Frontend/` directory (next to app.json)
3. Upload FCM Server Key to EAS:
   ```bash
   npx eas credentials
   # Select: Android → preview → Push Notifications
   ```

### App Configuration

**app.json:**
- Package: `com.hostelhub.app`
- Version: `1.0.0`
- Firebase: `googleServicesFile` configured

**eas.json:**
- Preview build: APK
- Production build: APK/AAB
- OTA updates: Enabled

## 🎨 Features Deep Dive

### Gate Pass System
- Digital passes with QR codes
- Parent approval workflow
- Real-time status tracking
- Guard verification via QR scanner
- Automatic expiry handling

### Mess Menu & Ratings
- Weekly menu display (7 days)
- Meal ratings (1-5 stars)
- **Time-restricted rating windows:**
  - Opens when meal starts
  - Closes 12 hours after meal start
  - Prevents duplicate ratings
  - Day-based validation (IST timezone)
- Dynamic timing management
- Staff can edit menu and timings

### Attendance System
- Smart check-in/check-out
- Real-time tracking
- Parent visibility
- Historical records

### Notification System
- Firebase Cloud Messaging
- Push notifications for:
  - Gate pass approvals/rejections
  - Parent gate pass requests
  - Important announcements
  - Complaint updates
- Notification center in-app

## 🔐 Security Features

- JWT token authentication
- Secure token storage (expo-secure-store)
- Role-based access control
- FCM server key stored in EAS
- Environment variables for sensitive data

## 🌐 API Integration

**Backend:** Node.js + Express + MongoDB  
**API Client:** Axios with interceptors  
**State Management:** React Query for caching  
**Authentication:** JWT tokens

API endpoints handled via `lib/services.ts`:
- Auth (login/register)
- Gate passes (CRUD)
- Complaints (CRUD)
- Notices (read)
- Attendance (track)
- Mess menu (read/rate)
- Payments (read)
- Notifications (read/update)

## 📊 Key Technologies Explained

### React Query
- Server state caching
- Automatic refetching
- Optimistic updates
- Background sync

### Expo Router
- File-based routing
- Nested layouts
- Deep linking support
- Type-safe navigation

### IST Timezone Handling
- Custom `getISTTime()` utility
- Prevents timezone bugs
- Consistent across all features
- Handles midnight boundaries

## 🐛 Known Issues & Solutions

### Issue: Notifications Silent in Expo Go
**Solution:** Build development/preview APK with `eas build`

### Issue: QR Scanner Not Working
**Solution:** Grant camera permissions in device settings

### Issue: Rating Window Times Incorrect
**Solution:** App uses IST timezone utilities (`lib/timezone.ts`)

## 📱 Supported Platforms

- ✅ Android 5.0+ (API 21+)
- ⚠️ iOS (not fully tested)

## 🔄 OTA Updates

Over-the-air updates enabled via EAS Update:
```bash
# Publish update to preview channel
npx eas update --branch preview

# Users get updates automatically
```

## 📝 Development Guidelines

### Code Style
- TypeScript strict mode
- Functional components with hooks
- React Query for server state
- Context for global state

### File Naming
- Components: PascalCase (`DashboardCard.tsx`)
- Utilities: camelCase (`timezone.ts`)
- Screens: kebab-case (`mess-menu.tsx`)

### State Management
- Server state: React Query
- Auth state: Context
- Theme state: Context
- Local state: useState

## 🤝 Contributing

This is a private hostel management system. For development:

1. Follow existing code structure
2. Use TypeScript for type safety
3. Test on physical Android device
4. Update README for new features

## 📄 License

[MIT License](../LICENSE) - See LICENSE file for details

## 👨‍💻 Developed By

Hostel Management System Team

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Build System:** EAS Build  
**Backend:** Node.js + Express + MongoDB
