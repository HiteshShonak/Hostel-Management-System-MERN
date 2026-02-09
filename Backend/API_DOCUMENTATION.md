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
**Response:** `201 Created` - Returns user object with token

---

### Login
```http
POST /auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:** `200 OK` - Returns user object with token

---

### Get Current User
```http
GET /auth/me
```
**Auth:** Required  
**Response:** `200 OK` - Returns current user profile

---

## 🎫 Gate Pass Endpoints

### Get User's Gate Passes
```http
GET /gatepass?page=1&limit=10
```
**Auth:** Required  
**Response:** Paginated list of gate passes

---

### Request New Gate Pass
```http
POST /gatepass
```
**Auth:** Required (Student)  
**Body:**
```json
{
  "reason": "Going home for weekend",
  "fromDate": "2026-01-20",
  "toDate": "2026-01-22"
}
```
**Response:** `201 Created` - Gate pass with PENDING status

---

### Approve Gate Pass (Warden)
```http
PUT /gatepass/:id/approve
```
**Auth:** Required (Warden/Admin)  
**Response:** `200 OK` - Approved pass with QR code

---

### Reject Gate Pass (Warden)
```http
PUT /gatepass/:id/reject
```
**Auth:** Required (Warden/Admin)  
**Body:**
```json
{
  "reason": "Exams are ongoing"
}
```

---

### Validate Gate Pass (Guard)
```http
POST /gatepass/validate
```
**Auth:** Required (Guard)  
**Body:**
```json
{
  "qrValue": "GP-ABC12345"
}
```

---

### Mark Exit (Guard)
```http
PUT /gatepass/:id/exit
```
**Auth:** Required (Guard)

---

### Mark Entry (Guard)
```http
PUT /gatepass/:id/entry
```
**Auth:** Required (Guard)

---

## 📍 Attendance Endpoints

### Get Attendance History
```http
GET /attendance?page=1&limit=30
```
**Auth:** Required

---

### Mark Attendance
```http
POST /attendance/mark
```
**Auth:** Required (Student)  
**Body:**
```json
{
  "latitude": 30.7652,
  "longitude": 76.7872
}
```
**Note:** Must be within 50m of hostel coordinates

---

### Get Attendance Stats
```http
GET /attendance/stats
```
**Auth:** Required

---

## 🍽️ Mess Menu Endpoints

### Get This Week's Menu
```http
GET /messmenu
```
**Response:** Weekly menu with timings

---

### Update Menu (Mess Staff)
```http
POST /messmenu
```
**Auth:** Required (Mess Staff/Admin)  
**Body:**
```json
{
  "day": "Monday",
  "breakfast": "Poha, Tea",
  "lunch": "Rice, Dal, Roti",
  "dinner": "Paneer, Roti, Rice"
}
```

---

### Rate Food
```http
POST /foodrating
```
**Auth:** Required (Student)  
**Body:**
```json
{
  "meal": "lunch",
  "rating": 4,
  "date": "2026-01-19"
}
```

---

## 📢 Notice Endpoints

### Get All Notices
```http
GET /notices?page=1&limit=10
```
**Response:** Paginated list of notices

---

### Create Notice (Warden)
```http
POST /notices
```
**Auth:** Required (Warden/Admin)  
**Body:**
```json
{
  "title": "Hostel Inspection",
  "content": "Room inspection on Monday",
  "priority": "high"
}
```

---

## 📝 Complaint Endpoints

### Get Complaints
```http
GET /complaints?page=1&limit=10
```
**Auth:** Required  
**Note:** Students see own, Wardens see all

---

### Create Complaint
```http
POST /complaints
```
**Auth:** Required (Student)  
**Body:**
```json
{
  "category": "maintenance",
  "description": "AC not working"
}
```

---

### Update Complaint Status (Warden)
```http
PUT /complaints/:id/status
```
**Auth:** Required (Warden/Admin)  
**Body:**
```json
{
  "status": "in_progress",
  "remarks": "Technician assigned"
}
```

---

## 👨‍👩‍👧 Parent Endpoints

### Get Linked Children
```http
GET /parent/children
```
**Auth:** Required (Parent)

---

### Get Pending Pass Approvals
```http
GET /parent/pending-passes
```
**Auth:** Required (Parent)

---

### Approve Child's Pass
```http
PUT /parent/pass/:id/approve
```
**Auth:** Required (Parent)

---

### Reject Child's Pass
```http
PUT /parent/pass/:id/reject
```
**Auth:** Required (Parent)  
**Body:**
```json
{
  "reason": "Not allowed"
}
```

---

## 🚨 Emergency Endpoints

### Trigger SOS
```http
POST /emergency/sos
```
**Auth:** Required (Student)  
**Body:**
```json
{
  "latitude": 30.7652,
  "longitude": 76.7872
}
```

---

### Get Active Alerts (Warden)
```http
GET /emergency/alerts
```
**Auth:** Required (Warden/Admin)

---

### Resolve Alert (Warden)
```http
PUT /emergency/alerts/:id/resolve
```
**Auth:** Required (Warden/Admin)

---

## 🔔 Notification Endpoints

### Get Notifications
```http
GET /notifications?page=1&limit=20
```
**Auth:** Required

---

### Get Unread Count
```http
GET /notifications/unread-count
```
**Auth:** Required

---

### Mark as Read
```http
PUT /notifications/:id/read
```
**Auth:** Required

---

### Mark All as Read
```http
PUT /notifications/read-all
```
**Auth:** Required

---

## 📊 Response Format

### Success Response
```json
{
  "statusCode": 200,
  "data": { ... },
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

| Role | Description |
|------|-------------|
| `student` | Default role, can request passes, mark attendance |
| `parent` | Can approve/reject child's gate passes |
| `warden` | Can approve passes, issue notices, manage complaints |
| `guard` | Can scan QR codes, mark entry/exit |
| `mess_staff` | Can update mess menu |
| `admin` | Full access to all features |

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
