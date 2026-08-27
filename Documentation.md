# 🏨 Smart Hostel Management System (HMS) — Technical Documentation

### Indian Institute of Information Technology, Sonepat (IIIT Sonepat)

---

## 📋 Executive Overview

**Smart Hostel Management System (HMS)** is a production-ready mobile and cloud platform engineered for comprehensive hostel operations. Built as a mobile-first application using **React Native (Expo SDK 54)** and a **Node.js (Express) REST API**, it orchestrates digital workflows across six distinct user roles: **Students**, **Parents**, **Guards**, **Wardens**, **Helpers**, and **System Administrators**.

---

## 🏗️ System Architecture & Codebase Map

### 1. High-Level Architecture
```text
┌─────────────────────────────────────────────────────────────┐
│             React Native Mobile App (Expo SDK 54)           │
│        (File-based routing, TanStack Query, SecureStore)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST API
┌──────────────────────────────▼──────────────────────────────┐
│                  Express.js / Node.js API                    │
│     (JWT Auth, RBAC, Rate Limiting, Zod Validation, Helmet)  │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼──────────────┐┌──────────────▼───────────────┐
│     MongoDB (Mongoose)      ││        Redis (ioredis)        │
│  (11 Production Collections)││ (Menu & System Cache Layer)   │
└─────────────────────────────┘└──────────────────────────────┘
```

---

### 2. Frontend Directory Structure (`Frontend/`)

```text
Frontend/
├── app/                              # Expo Router file-based screens
│   ├── _layout.tsx                   # Root provider wrapper (Auth, Theme, QueryClient)
│   ├── index.tsx                     # Role-aware central dashboard hub
│   ├── login.tsx                     # Authentication login screen
│   ├── register.tsx                  # Student account registration
│   │
│   ├── shared/                       # Shared utility screens (All authenticated roles)
│   │   ├── gate-pass.tsx             # Digital QR gate pass management & creation
│   │   ├── emergency.tsx             # 3-second hold Emergency SOS & incident responder
│   │   ├── notices.tsx               # Announcement board & broadcast center
│   │   ├── complaints.tsx            # Hostel maintenance issue ticketing
│   │   ├── food-ratings.tsx          # Real-time time-windowed meal feedback
│   │   ├── qr-scanner.tsx            # Camera QR scanner for pass verification
│   │   ├── notifications.tsx         # Notification center & read receipts
│   │   ├── profile.tsx               # User profile & personal details
│   │   └── settings.tsx              # App theme & preferences
│   │
│   ├── mess/                         # Mess operations
│   │   └── mess-menu.tsx             # Daily meal viewer & serving hours scheduler
│   │
│   ├── parent/                       # Parent portal
│   │   ├── children.tsx              # Linked student profile cards
│   │   ├── pending-passes.tsx        # Pass approval interface
│   │   └── pass-history.tsx          # Child pass audit trail
│   │
│   ├── guard/                        # Security desk
│   │   ├── activity-logs.tsx         # Gate entry/exit ledger
│   │   ├── students-out.tsx          # Real-time list of students outside
│   │   └── recent-entries.tsx        # Students returned today
│   │
│   ├── warden/                       # Hostel administration
│   │   ├── students.tsx              # Resident student directory
│   │   ├── student-detail.tsx        # Resident detail & emergency contact sheet
│   │   └── pass-history.tsx          # Institutional gate pass ledger
│   │
│   ├── helper/                       # Support staff
│   │   ├── register-user.tsx         # On-campus assisted user onboarding
│   │   └── reset-password.tsx        # Credential recovery portal
│   │
│   └── admin/                        # Superuser tools
│       ├── users.tsx                 # Full user account management & role assignment
│       ├── link-parent.tsx           # Parent-to-student linking wizard
│       ├── parent-links.tsx          # Active relationship ledger
│       ├── config.tsx                # Geofence & system configuration
│       └── stats.tsx                 # High-level institutional analytics
│
├── components/                       # Modular UI Components (<180 lines/file)
│   ├── dashboard/                    # Role dashboard widgets & metric cards
│   ├── emergency/                    # SOS button, Quick SOS grid, Contact list, Alert cards
│   ├── food-ratings/                 # Star rating modal, meal summary bar, score distribution
│   ├── forms/                        # Role selector grid, password inputs, academic pickers
│   ├── mess/                         # Meal cards, serving hours bar, timing editor
│   ├── qr-scanner/                   # Scanner overlay, pass result card, camera header
│   └── ui/                           # Base primitives (TimeScrollPicker, PageHeader, Modal, Tabs)
│
└── lib/                              # Core clients, hooks & utilities
    ├── api.ts                        # Axios instance with auth interceptor
    ├── hooks.ts                      # TanStack React Query custom hooks
    ├── services.ts                   # Modular API service layer
    ├── types.ts                      # Strict TypeScript interfaces
    ├── timezone.ts                   # IST timezone calculation engine
    └── contexts/                     # Theme & Auth contexts
```

---

### 3. Backend Directory Structure (`Backend/`)

```text
Backend/
├── src/
│   ├── controllers/                  # Endpoint request handlers (11 domains)
│   │   ├── auth.controller.ts        # Authentication & JWT issuance
│   │   ├── gatepass.controller.ts    # Gate pass lifecycle & QR verification
│   │   ├── messmenu.controller.ts    # Mess menu & serving hour schedule
│   │   ├── foodrating.controller.ts  # Meal ratings & score aggregation
│   │   ├── emergency.controller.ts   # SOS trigger & resolution workflow
│   │   ├── complaint.controller.ts   # Complaint submission & status tracking
│   │   ├── notice.controller.ts      # Broadcast notice creation & delivery
│   │   ├── notification.controller.ts# In-app push notifications
│   │   ├── parent.controller.ts      # Parent-child linking & pass approvals
│   │   ├── helper.controller.ts      # Helper assisted registrations & resets
│   │   └── admin.controller.ts       # System metrics, user management, config
│   │
│   ├── models/                       # Mongoose Database Schemas (11 Collections)
│   │   ├── User.ts                   # Account credentials, roles, profile details
│   │   ├── GatePass.ts               # Pass requests, QR values, status
│   │   ├── GatePassLog.ts            # Guard entry/exit timestamp records
│   │   ├── ParentStudent.ts          # Verified parent-child linkages
│   │   ├── FoodRating.ts             # Meal rating records (compound unique indexing)
│   │   ├── MessMenu.ts               # Weekly recurring menu & meal timings
│   │   ├── Complaint.ts              # Maintenance & facility issue tickets
│   │   ├── Notice.ts                 # Institutional announcements
│   │   ├── Notification.ts           # Targeted notifications
│   │   ├── Emergency.ts              # Active SOS incidents & location tags
│   │   └── SystemConfig.ts           # System parameters & geofence rules
│   │
│   ├── routes/                       # Express REST router definitions
│   ├── middleware/                   # JWT auth, RBAC, rate-limiting, sanitization, error handling
│   ├── schemas/                      # Zod validation schemas
│   ├── services/                     # JWT tokens & Expo push notifications
│   └── utils/                        # Logger, ApiError, ApiResponse, Redis cache, IST timezone
```

---

## 👥 Role Matrix & Workflows

| Role | Operational Scope & Features |
| :--- | :--- |
| 🎓 **Student** | • **Gate Passes**: Create pass requests, track approval status, and display single-use QR codes.<br/>• **Mess & Food Ratings**: View weekly meals and rate breakfast, lunch, and dinner during dynamic 12h serving windows.<br/>• **Notices & Complaints**: View announcements and file maintenance tickets.<br/>• **Emergency SOS**: 3-second hold-to-send panic button alerting wardens and security with live location. |
| 👨‍👩‍👧 **Parent** | • **Child Monitoring**: View linked student profiles.<br/>• **Gate Pass Approvals**: Multi-tier pass review (Parent approval required prior to Warden authorization).<br/>• **Audit Ledger**: Review complete pass history. |
| 🛡️ **Guard** | • **QR Validation**: High-speed camera scanner to validate passes at the gate.<br/>• **Live Tracking**: Real-time roster of students currently outside vs. returned today.<br/>• **Audit Logs**: Automatic logging of entry/exit timestamps. |
| 📋 **Warden** | • **Final Pass Authorization**: Approve/reject parental-cleared passes.<br/>• **Student Directory**: Access resident student records and emergency contact sheets.<br/>• **Incident Responder**: Real-time SOS alert monitor with acknowledge and resolve controls. |
| 🛠️ **Helper** | • **Assisted Onboarding**: On-ground account registration for hostel staff and students.<br/>• **Password Recovery**: Secure password reset portal for residents. |
| ⚙️ **Admin** | • **Access Management**: Full CRUD over accounts, roles, and status.<br/>• **Parent Linking**: Manage parent-student linkage pairings.<br/>• **Configuration**: Control geofencing parameters and operational timings.<br/>• **System Analytics**: Real-time operational metrics across all modules. |

---

## 🗄️ Database Architecture (MongoDB)

| Collection | Description | Primary Key & Compound Indexes |
| :--- | :--- | :--- |
| `users` | All system accounts | `_id`, Unique: `email`, Index: `role` |
| `gatepasses` | Gate pass requests | `_id`, Compound: `[user, status]`, Unique: `qrValue` |
| `gatepasslogs` | Guard entry/exit scans | `_id`, Index: `gatePass`, `timestamp` |
| `parentstudents`| Parent-student pairings | `_id`, Compound Unique: `[parent, student]` |
| `foodratings` | Meal feedback entries | `_id`, Compound Unique: `[user, mealType, date]` |
| `messmenus` | Weekly menu schedules | `_id`, Index: `day` |
| `complaints` | Maintenance tickets | `_id`, Index: `user`, `status`, `category` |
| `notices` | Announcements | `_id`, Index: `createdAt`, `urgent` |
| `notifications`| In-app user notifications| `_id`, Index: `user`, `read` |
| `emergencies` | SOS incident alerts | `_id`, Index: `status`, `createdAt` |
| `systemconfigs`| Institutional settings | `_id` |

---

## 🔐 Security & Data Protection

1. **Authentication & Authorization**:
   - Industry-standard **JWT** bearer authentication stored in hardware-backed `expo-secure-store`.
   - **Role-Based Access Control (RBAC)** enforced at router and controller levels.
2. **Defensive API Hardening**:
   - **Helmet**: Secure HTTP response headers.
   - **CORS Whitelisting**: Strict origin controls.
   - **Rate Limiting**: Multi-tiered rate limiting preventing brute-force attacks.
   - **Input Sanitization & Zod Validation**: Strict payload validation preventing injection attacks.
3. **Cryptographic Single-Use QR Codes**:
   - Gate passes generate unique, tamper-proof QR tokens verified against the live database at gate scan.

---

## ⏱️ Indian Standard Time (IST) Engine

To eliminate midnight-boundary and day-shift bugs across mobile devices and UTC cloud servers:
- All meal rating windows and gate pass dates are normalized through centralized **IST timezone utilities** (`getISTDate()`, `getISTTime()`).
- Meal rating windows lock validation day at request start, preventing duplicate or mismatched evaluations across day changes.

---

## 📄 Documentation Index

- **[README.md](README.md)** — Project overview & quick start
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — Contributor guidelines & code standards
- **[Backend API Reference](Backend/API_DOCUMENTATION.md)** — Comprehensive endpoint schemas
