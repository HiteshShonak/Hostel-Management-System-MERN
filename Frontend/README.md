# 📱 HMS Mobile App (Frontend)

Mobile client for the **Smart Hostel Management System (HMS)** at **IIIT Sonepat**, built with **React Native** and **Expo SDK 54**.

---

## 🚀 Tech Stack

- **Framework**: React Native 0.81.5 + Expo SDK 54
- **Routing**: Expo Router (File-based routing)
- **Language**: TypeScript 5.9
- **State Management**: TanStack React Query 5.64 + React Context (Auth, Theme)
- **Device APIs**: `expo-camera`, `expo-notifications`, `expo-location`, `expo-secure-store`
- **Modular Components**: Strict component size policy (<180 lines/file)

---

## 📂 Route Directory Structure

```text
Frontend/app/
├── _layout.tsx               # Root application wrapper (Auth, Theme, QueryClient)
├── index.tsx                 # Dynamic role-based dashboard router
├── login.tsx                 # User authentication
├── register.tsx              # Student registration
│
├── shared/                   # Common authenticated modules
│   ├── gate-pass.tsx         # Pass creation & QR view
│   ├── emergency.tsx         # 3-second hold SOS panic button
│   ├── notices.tsx           # Announcements board
│   ├── complaints.tsx        # Maintenance issue ticketing
│   ├── food-ratings.tsx      # Time-windowed meal ratings
│   ├── qr-scanner.tsx        # Camera QR scanner
│   ├── notifications.tsx     # In-app notifications
│   ├── profile.tsx           # Profile management
│   └── settings.tsx          # Theme & app settings
│
├── mess/
│   └── mess-menu.tsx         # Daily meal viewer & timing scheduler
│
├── parent/
│   ├── children.tsx          # Linked child overview
│   ├── pending-passes.tsx    # Parental approval interface
│   └── pass-history.tsx      # Pass history
│
├── guard/
│   ├── activity-logs.tsx     # Entry/exit logs
│   ├── students-out.tsx      # Students currently outside
│   └── recent-entries.tsx    # Students returned today
│
├── warden/
│   ├── students.tsx          # Resident directory
│   ├── student-detail.tsx    # Resident detail & emergency contact sheet
│   └── pass-history.tsx      # Pass approval history
│
├── helper/
│   ├── register-user.tsx     # Assisted student/staff registration
│   └── reset-password.tsx    # Assisted password reset
│
└── admin/
    ├── users.tsx             # User accounts & role management
    ├── link-parent.tsx       # Parent-child linking tool
    ├── parent-links.tsx      # Active relationship directory
    ├── config.tsx            # Geofence & system configurations
    └── stats.tsx             # Institutional statistics
```

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Set EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:5000/api

# 3. Typecheck & start
npx tsc --noEmit
npx expo start
```
