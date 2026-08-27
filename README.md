<div align="center">

# 🏨 HMS - Smart Hostel Management System

### IIIT Sonepat

_A modern full-stack mobile platform for day-to-day hostel operations_

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
> Featuring QR gate passes, mess menu & ratings, emergency SOS & push notifications.

</div>

---

## 📱 Features by Role

| Role | Key Capabilities |
| :--- | :--- |
| 🎓 **Students** | • Digital QR Gate Passes with geofence validation<br/>• Mess weekly menu with serving hour scheduler & meal ratings<br/>• In-app notice board & maintenance complaints tracker<br/>• 3-second hold-to-trigger Emergency SOS with live location |
| 👨‍👩‍👧 **Parents** | • Linked student profiles & gate pass approval workflow<br/>• Historical gate pass logs & status updates |
| 🛡️ **Guards** | • Real-time camera QR scanner with instant entry/exit validation<br/>• Live student tracking (currently outside hostel vs returned today) |
| 📋 **Wardens** | • Two-tier gate pass approvals & full pass history<br/>• Student directory & active emergency SOS incident management |
| ⚙️ **Admins** | • User access management & role assignment<br/>• Parent-student account linking & system geofence configurations |

---

## 🏗️ Architecture & Tech Stack

```text
HMS-Mobile/
├── Frontend/           # React Native (Expo SDK 54, Expo Router, TypeScript)
│   ├── app/           # Role-based screens (student, parent, warden, guard, admin)
│   ├── components/    # Modular UI components (<180 lines/file)
│   └── lib/           # API clients, TanStack Query hooks, Contexts, Types
│
└── Backend/            # Node.js + Express + TypeScript
    ├── src/controllers# Business logic & request handlers
    ├── src/models     # Mongoose schemas (Users, GatePasses, Mess, SOS, Notices)
    ├── src/routes     # REST API routes with Zod validation
    └── src/middleware # Auth (JWT), rate limiting, helmet, input sanitization
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18+ & **npm**
- **MongoDB** (Local instance or MongoDB Atlas)
- **Redis** (Optional caching layer)
- **Expo Go** app on iOS / Android (for physical device testing)

### 1. Backend Setup
```bash
cd Backend
npm install
cp .env.example .env
npm run dev
# Server running at http://localhost:5000 (Health check: /health)
```

### 2. Frontend Setup
```bash
cd ../Frontend
npm install
cp .env.example .env
# Set EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:5000/api in Frontend/.env
npx expo start
# Scan QR code with Expo Go app or press 'a' for Android emulator
```

### 3. Verification & Quality Checks
```bash
# Type check Frontend & Backend
cd Frontend && npx tsc --noEmit
cd ../Backend && npx tsc --noEmit
```

---

## 🔒 Security Features

- 🔐 **JWT Authentication & RBAC**: Strict role-based endpoint protection (Student, Parent, Guard, Warden, Admin).
- 🛡️ **Defensive Headers & Sanitization**: Helmet HTTP protection, CORS domain whitelisting, and XSS input sanitization.
- ⏱️ **Rate Limiting**: Multi-tiered protection against brute-force and DDoS attempts.
- 📱 **QR Cryptographic Validation**: Tamper-proof, single-use gate pass verification.

---

## 📚 Documentation

- **[Full Documentation](Documentation.md)** - Comprehensive architectural deep-dive
- **[Backend API Reference](Backend/API_DOCUMENTATION.md)** - REST API endpoints & payload schemas
- **[Deployment Guide](deployment_guide.md)** - Production cloud deployment steps
- **[Build & Testing Guide](build_testing_guide.md)** - EAS standalone APK/IPA compilation

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For the full setup instructions, environment configuration, testing requirements, and Git guidelines, please see the **[Contribution Guide (CONTRIBUTING.md)](CONTRIBUTING.md)**.

---

## 📄 License & Credits

Distributed under the **MIT License**. See `LICENSE` for more information.

Developed with ❤️ at **Indian Institute of Information Technology, Sonepat (IIIT Sonepat)**.
