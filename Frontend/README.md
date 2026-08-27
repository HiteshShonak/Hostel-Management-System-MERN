# HMS - Mobile App | IIIT Sonepat

Mobile app for **IIIT Sonepat** hostel operations, built with React Native and Expo for iOS and Android. It supports students, parents, guards, wardens, and administrators with role-based access.

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

- **expo-camera** - QR code scanning
- **expo-notifications** - Push notifications (Expo Push API)
- **expo-location** - Emergency location services
- **expo-secure-store** - Secure token storage
- **@react-native-community/datetimepicker** - Date/time pickers
- **react-native-qrcode-svg** - QR code generation

### Build & Deployment

- **EAS Build** - Production APK builds
- **EAS Updates** - OTA updates
- **Expo Push Notifications** - Native push notification service

## 📱 Supported Platforms

- ✅ **Android** 5.0+ (API 21+) - Fully tested
- ✅ **iOS** 11.0+ - Fully tested
- 📱 **Mobile-only application** - Not designed for web

**Testing:** Verified on both Android and iOS using Expo Go during development. Production builds tested on physical devices.

## 📱 Features

### Student Features

- **Dashboard** - Quick access to all services
- **Gate Pass** - Request and manage digital gate passes with QR codes
- **Mess Menu & Ratings** - Weekly menu with time-restricted meal ratings
- **Complaints** - Submit and track complaints with categories
- **Notices** - View hostel announcements
- **Emergency** - Quick SOS with location sharing
- **Food Ratings** - Rate meals within 12-hour windows
- **Profile & Settings** - Manage personal information and preferences
- **Notifications** - Real-time push notifications

### Parent Features

- **Children Dashboard** - View linked student's information
- **Pending Passes** - Approve/reject gate pass requests
- **Pass History** - View past gate passes
- **Notifications** - Alerts for gate pass requests

### Guard Features

- **QR Scanner** - Verify gate passes
- **Activity Logs** - View entry/exit history
- **Students Outside** - Live list of students currently out
- **Recent Entries** - Students who returned today

### Warden Features

- **Pass Management** - Approve/reject gate passes
- **Pass History** - Review all gate passes
- **Student Management** - Student list + detail view

### Admin Features

- **User Management** - Manage users and roles
- **Parent-Student Linking** - Link and unlink parent accounts
- **System Configuration** - Geofence, pass limits
- **System Statistics** - Users, passes, complaints, notices

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
│   ├── complaints.tsx           # Complaint system (19KB)
│   ├── notices.tsx              # Notice board (18KB)
│   ├── emergency.tsx            # Emergency SOS (16KB)
│   ├── profile.tsx              # User profile (14KB)
│   ├── food-ratings.tsx         # Meal ratings (17KB)
│   ├── notifications.tsx        # Notification center (9KB)
│   ├── settings.tsx             # App settings (11KB)
│   ├── qr-scanner.tsx           # QR code scanner (29KB)
│   │
│   ├── admin/                   # Admin-only screens
│   │   ├── users.tsx           # User management
│   │   ├── stats.tsx           # System stats
│   │   ├── config.tsx          # System config
│   │   ├── link-parent.tsx     # Link parent to student
│   │   └── parent-links.tsx    # Manage links
│   │
│   ├── parent/                  # Parent-only screens
│   │   ├── children.tsx        # Linked students
│   │   ├── pending-passes.tsx  # Pass approvals
│   │   ├── pass-history.tsx    # Historical passes
│   │
│   ├── guard/                   # Guard-only screens
│   │   ├── activity-logs.tsx   # Entry/exit logs
│   │   ├── students-out.tsx    # Students outside
│   │   └── recent-entries.tsx  # Recent entries
│   │
│   └── warden/                  # Warden-only screens
│       ├── students.tsx        # Student list
│       ├── student-detail.tsx  # Student detail
│       └── pass-history.tsx    # Pass history
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
# EXPO_PUBLIC_API_URL=http://your_backend_url_here/api
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

### Expo Push Notifications Setup

Push notifications are automatically configured via Expo's native push service. No additional setup required for development!

**For Production:**

1. Build with EAS: `eas build --platform android`
2. Expo handles push notification credentials automatically
3. Test notifications via backend API

**How it works:**

- Uses Expo Push Token (not FCM)
- Backend sends to `https://exp.host/--/api/v2/push/send`
- No Firebase configuration needed

### App Configuration

**app.json:**

- Package: `com.hostelhub.app`
- Version: `1.0.0`
- Expo Project ID: `d0ca44c9-b72a-424f-88e5-ff0c4a1938b1`

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

### Notification System

- Expo Push Notifications (native service)
- Push notifications for:
  - Gate pass approvals/rejections
  - Parent gate pass requests
  - Important announcements
  - Complaint updates
- Notification center in-app
- Works on both Android and iOS

## 🔐 Security Features

- JWT token authentication
- Secure token storage (expo-secure-store)
- Role-based access control
- Expo Push Token management
- Environment variables for sensitive data

## 🌐 API Integration

**Backend:** Node.js + Express + MongoDB  
**API Client:** Axios with interceptors  
**State Management:** React Query for caching  
**Authentication:** JWT tokens

API endpoints handled via `lib/services.ts`:

- Auth (login/register/profile/push token)
- Gate passes (request/approve/validate/entry-exit)
- Complaints (create/status/resolve)
- Notices (read + staff create/update/delete)
- Mess menu (read/update timings)
- Food ratings (rate/average/my ratings)
- Notifications (read/unread/mark/delete)
- Parent portal (children/passes)
- Admin (users/parent links/system config/stats)

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

Hostel Management System - IIIT Sonepat

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Build System:** EAS Build  
**Backend:** Node.js + Express + MongoDB
