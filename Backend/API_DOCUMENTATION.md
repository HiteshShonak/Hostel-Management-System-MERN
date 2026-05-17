# SmartHostel API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Auth Endpoints

### Register User

```http
POST /auth/register
```

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "rollNo": "12345678",
  "room": "A101",
  "hostel": "Boys Hostel 1",
  "phone": "9876543210",
  "role": "student",
  "parentEmail": "parent@example.com"
}
```

### Login

```http
POST /auth/login
```

### Get Current User

```http
GET /auth/me
```

### Update Profile

```http
PUT /auth/profile
```

**Body:**

```json
{ "name": "New Name", "phone": "9999999999", "room": "B201" }
```

### Change Password

```http
PUT /auth/password
```

**Body:**

```json
{ "currentPassword": "old", "newPassword": "newpass123" }
```

### Update Push Token

```http
PUT /auth/push-token
```

**Body:**

```json
{ "pushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]" }
```

---

## 🎫 Gate Pass Endpoints

```http
GET  /gatepass
GET  /gatepass/current
GET  /gatepass/pending
GET  /gatepass/all
POST /gatepass
PUT  /gatepass/:id/approve
PUT  /gatepass/:id/reject
POST /gatepass/validate
PUT  /gatepass/:id/exit
PUT  /gatepass/:id/entry
GET  /gatepass/students-out
GET  /gatepass/recent-entries
GET  /gatepass/logs
```

---

## 📍 Attendance Endpoints

```http
GET  /attendance
POST /attendance/mark
GET  /attendance/today
GET  /attendance/stats
```

**Mark Attendance Body:**

```json
{ "latitude": 30.7652, "longitude": 76.7872 }
```

---

## 🍽️ Mess Menu & Food Rating

```http
GET  /messmenu
PUT  /messmenu/timings
PUT  /messmenu/:day

POST /food-rating
GET  /food-rating/average
GET  /food-rating/my
GET  /food-rating/my-ratings
```

**Rate Food Body:**

```json
{ "mealType": "Lunch", "rating": 4, "comment": "Good" }
```

---

## 📢 Notice Endpoints

```http
GET    /notices
POST   /notices
PUT    /notices/:id
DELETE /notices/:id
```

---

## 📝 Complaint Endpoints

```http
GET  /complaints
POST /complaints
GET  /complaints/all
PUT  /complaints/:id/status
PUT  /complaints/:id/resolve
```

---

## 👨‍👩‍👧 Parent Endpoints

```http
GET /parent/children
GET /parent/pending-passes
GET /parent/passes
PUT /parent/passes/:id/approve
PUT /parent/passes/:id/reject
GET /parent/today-attendance
GET /parent/children/:studentId/attendance
```

---

## 🚨 Emergency Endpoints

```http
POST /emergency
POST /emergency/sos
GET  /emergency
GET  /emergency/history
GET  /emergency/contacts
GET  /emergency/active
PUT  /emergency/:id/acknowledge
PUT  /emergency/:id/resolve
```

---

## 🔔 Notification Endpoints

```http
GET    /notifications
GET    /notifications/unread-count
PUT    /notifications/read-all
PUT    /notifications/:id/read
DELETE /notifications/:id
```

---

## 🛡️ Admin Endpoints

```http
GET    /admin/config
PUT    /admin/config
GET    /admin/system-stats
GET    /admin/stats
POST   /admin/link-parent
DELETE /admin/link-parent/:id
GET    /admin/parent-links
GET    /admin/users
GET    /admin/user/:id/relations
PUT    /admin/users/:id/role
DELETE /admin/users/:id
GET    /admin/gate-passes
PUT    /admin/gate-passes/:id/approve
DELETE /admin/gate-passes/:id
GET    /admin/attendance
GET    /admin/notices
DELETE /admin/notices/:id
GET    /admin/complaints
GET    /admin/warden/dashboard-stats
GET    /admin/warden/students
GET    /admin/warden/students/:id
POST   /admin/warden/mark-attendance/:studentId
```

---

## 🧪 Testing Endpoints (non-production)

```http
POST /test/push-to-me
POST /test/push-to-students
GET  /test/push-status
```

---

## 📊 Response Format

### Success Response

```json
{
  "statusCode": 200,
  "data": { "...": "..." },
  "message": "Success",
  "success": true
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [],
  "stack": "(development only)"
}
```

---

## 🔑 User Roles

| Role         | Description                                          |
| ------------ | ---------------------------------------------------- |
| `student`    | Default role, can request passes, mark attendance    |
| `parent`     | Can approve/reject child's gate passes               |
| `warden`     | Can approve passes, issue notices, manage complaints |
| `guard`      | Can scan QR codes, mark entry/exit                   |
| `mess_staff` | Can update mess menu and timings                     |
| `admin`      | Full access to all features                          |

---

## 📱 Health Check

```http
GET /health
```

**Response:**

```json
{
  "success": true,
  "message": "HMS Backend is running",
  "timestamp": "2026-01-19T16:00:00.000Z",
  "environment": "development"
}
```
