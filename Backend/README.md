# ⚡ HMS REST API (Backend)

Backend server for the **Smart Hostel Management System (HMS)** at **IIIT Sonepat**, built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, and **Redis**.

---

## 🚀 Tech Stack

- **Runtime & Framework**: Node.js 18+ & Express 4.21
- **Language**: TypeScript 5.9 (Strict mode)
- **Database**: MongoDB with Mongoose 8.9
- **Caching Layer**: Redis (ioredis 5.9)
- **Security**: JWT, bcryptjs, Helmet, Zod schema validation, Rate limiting, Input sanitization
- **Notifications**: Expo Push Notifications API

---

## 🗄️ Database Collections (11)

1. `users` — System accounts & roles (Student, Parent, Guard, Warden, Helper, Admin)
2. `gatepasses` — Gate pass requests & QR tokens
3. `gatepasslogs` — Guard scan entry/exit audit logs
4. `parentstudents` — Verified parent-child linkages
5. `foodratings` — 1-5 star meal ratings (Compound unique indexed)
6. `messmenus` — 7-day recurring meal menus & serving hours
7. `complaints` — Facility & maintenance issue tickets
8. `notices` — Institutional announcements & priority broadcasts
9. `notifications` — Targeted in-app push notifications
10. `emergencies` — SOS incident alerts & location records
11. `systemconfigs` — Geofencing rules & system parameters

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Typecheck & run development server
npx tsc --noEmit
npm run dev
# Server running at http://localhost:5000 (Health check: /health)
```
