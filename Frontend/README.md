# HMS Mobile (HostelHub)

React Native (Expo) port of the HostelHub hostel management web app.

## Tech Stack

- **Expo SDK 52**
- **Expo Router** - File-based routing
- **NativeWind** - Tailwind CSS for React Native
- **TypeScript**

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

```bash
# Navigate to the project
cd HMS-Mobile

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

After starting the dev server:
1. Scan the QR code with Expo Go (Android) or Camera app (iOS)
2. Or press `a` for Android emulator, `i` for iOS simulator

## Project Structure

```
HMS-Mobile/
├── app/                    # Screens (expo-router)
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Dashboard home
│   ├── gate-pass.tsx       # Gate pass with QR code
│   ├── mess-menu.tsx       # Mess menu with tabs
│   ├── attendance.tsx      # Smart attendance
│   ├── complaints.tsx      # Complaint box
│   ├── notices.tsx         # Notice board
│   ├── emergency.tsx       # Emergency SOS
│   ├── visitors.tsx        # Visitor management
│   ├── payments.tsx        # Payment history
│   ├── profile.tsx         # User profile
│   └── laundry.tsx         # Laundry tracking
├── components/
│   ├── ui/                 # Reusable UI components
│   └── dashboard/          # Dashboard-specific components
├── lib/
│   ├── utils.ts            # Utility functions (cn)
│   └── data.ts             # Mock data
├── assets/                 # App icons and images
├── tailwind.config.js      # Tailwind/NativeWind config
├── global.css              # Global styles
└── app.json                # Expo configuration
```

## Features

- 📱 **Dashboard** - Quick access to all features
- 🎫 **Gate Pass** - Digital pass with QR code
- 🍽️ **Mess Menu** - Weekly menu with ratings
- ✅ **Attendance** - Smart fingerprint-style check-in
- 📝 **Complaints** - Submit and track issues
- 📢 **Notices** - Important announcements
- 🚨 **Emergency** - SOS alerts to warden
- 👥 **Visitors** - Visitor registration
- 💳 **Payments** - Fee payment tracking
- 👤 **Profile** - User information
- 👕 **Laundry** - Laundry service tracking

## Conversion Notes

This app was converted from a Next.js web app with the following changes:

| Web | React Native |
|-----|--------------|
| `<div>` | `<View>` |
| `<p>`, `<span>`, `<h1>` | `<Text>` |
| `<button>` | `<Pressable>` / `<TouchableOpacity>` |
| `<input>` | `<TextInput>` |
| `next/link` | `expo-router` Link |
| `lucide-react` | `@expo/vector-icons` |
| `qrcode.react` | `react-native-qrcode-svg` |
| CSS Grid | Flexbox with percentage widths |
| Radix UI Tabs | Custom Tab component |
