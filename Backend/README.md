# HMS Backend API

Hostel Management System Backend built with Node.js, Express, TypeScript, and MongoDB.

## Quick Start

1. **Install dependencies**
   ```bash
   cd Backend
   npm install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Update `JWT_SECRET` with a secure secret key

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Server runs at** `http://localhost:5000`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/hms` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Gate Pass
- `GET /api/gatepass` - Get user's passes
- `GET /api/gatepass/current` - Get active pass
- `POST /api/gatepass` - Request new pass
- `PUT /api/gatepass/:id/approve` - Approve (admin)
- `PUT /api/gatepass/:id/reject` - Reject (admin)

### Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create notice (admin)

### Mess Menu
- `GET /api/messmenu` - Get full week menu
- `PUT /api/messmenu/:day` - Update menu (admin)

### Complaints
- `GET /api/complaints` - Get user's complaints
- `POST /api/complaints` - Submit complaint
- `PUT /api/complaints/:id/resolve` - Resolve (admin)

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/stats` - Get stats

### Visitors
- `GET /api/visitors` - Get visitors
- `POST /api/visitors` - Register visitor

### Payments
- `GET /api/payments` - Get payments
- `GET /api/payments/dues` - Get pending dues

### Laundry
- `GET /api/laundry` - Get laundry history
- `POST /api/laundry` - Schedule pickup

### Emergency
- `POST /api/emergency/sos` - Send SOS alert
- `GET /api/emergency/contacts` - Get emergency contacts

## Project Structure

```
Backend/
├── src/
│   ├── index.ts          # Entry point
│   ├── app.ts            # Express config
│   ├── config/db.ts      # MongoDB connection
│   ├── types/index.ts    # TypeScript interfaces
│   ├── models/           # Mongoose schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API routes
│   └── middleware/       # Auth middleware
├── .env                  # Environment variables
├── package.json
└── tsconfig.json
```
