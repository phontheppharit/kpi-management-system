# 📊 KPI Management System

ระบบจัดการ KPI สำหรับผู้ใช้งานทั่วไปและผู้ดูแลระบบ  
สร้างด้วย **MERN Stack (MongoDB, Express.js, React, Node.js)**  
และ **Tailwind CSS** สำหรับ UI  

---

## ✨ Features

- 🔑 ระบบ Authentication (Register / Login ด้วย JWT)  
- 👤 User Management (เฉพาะ Admin เท่านั้น)  
  - ดูรายชื่อผู้ใช้งานทั้งหมด  
  - เพิ่ม / แก้ไข / ลบผู้ใช้งาน  
- 📈 KPI Management  
  - ผู้ใช้ทั่วไปดู / เพิ่ม / แก้ไข / ลบ KPI ของตนเอง  
  - Admin ดูและจัดการ KPI ของผู้ใช้ทุกคนได้  
- 🖥️ Dashboard สรุปข้อมูล KPI ด้วย Chart  
- 🎨 UI ใช้ **Tailwind CSS** → สวยงามและ Responsive  

---

## 🚀 Setup Instructions

### 1. Clone โปรเจค
```bash
git clone https://github.com/phontheppharit/kpi-management-system
cd kpi-management-system
```
### 2. ติดตั้ง dependencies

Backend
```bash
cd kpi-management-system
npm install
```

Frontend
```bash
cd kpi-frontend
npm install
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ .env ในโฟลเดอร์ backend แล้วใส่ค่า:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
### 4. รันโปรเจค

เปิด terminal 2 อัน:

Backend
```bash
cd kpi-management-system
npm run dev
```

Frontend
```bash
cd kpi-frontend
npm start
```

---
### 📡 API Documentation
🔑 Authentication
```
POST /api/auth/register → สมัครสมาชิกใหม่
POST /api/auth/login → เข้าสู่ระบบ
```

👤 User Management (สำหรับ Admin)
```
GET /api/users → แสดงรายชื่อผู้ใช้งานทั้งหมด

POST /api/users → สร้างผู้ใช้งานใหม่

PUT /api/users/:id → แก้ไขผู้ใช้งาน

DELETE /api/users/:id → ลบผู้ใช้งาน
```

📈 KPI Management
```
GET /api/kpis/my → ดู KPI ของตัวเอง

POST /api/kpis → เพิ่ม KPI ใหม่

PUT /api/kpis/:id → แก้ไข KPI

DELETE /api/kpis/:id → ลบ KPI
```
---
### 🖼️ Demo Screenshots
Dashboard
![Dashboard Screenshot](docs/screenshots/dashboard.jpg)   
KPI Management
![KPI Management Screenshot](docs/screenshots/KpiManagement.jpg)
My KPI
![My KPI Screenshot](docs/screenshots/myKpi.jpg)
User Management
![User Management Screenshot](docs/screenshots/userManagement.jpg)

---
### 📂 Project Structure
```plaintext
kpi-management-system/
│
├── kpi-management-system/ # API และ Database (Node.js + Express + MongoDB)
│   ├── models/            # Mongoose Schemas
│   ├── routes/            # API Routes
│   ├── controllers/       # Logic ของแต่ละ Route
│   ├── middleware/        # JWT Auth Middleware
│   └── server.js          # Entry point
│
├── kpi-frontend/          # React + Tailwind CSS
│   ├── src/
│   │   ├── components/    # UI Components
│   │   ├── pages/         # หน้า Dashboard, KPI, User Management
│   │   └── App.jsx
│   └── package.json
│
├── docs/
│   └── screenshots/      # Screenshots สำหรับ README
│
└── README.md             # เอกสารโปรเจค
```

---
### 👨‍💻 Authors

Phonthep

# 📌 KPI Management System - Full API Documentation

## 🔑 Authentication API (`/api/auth`)

### 1. Register User

* **POST** `/api/auth/register`
* **Access**: Public
* **Request Body**:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456",
  "role": "User"
}
```

* **Success Response** `201`:

```json
{
  "msg": "User registered successfully",
  "user": {
    "id": "64fae1...",
    "username": "john",
    "email": "john@example.com",
    "role": "User"
  }
}
```

* **Error Responses**:

  * `400` → User already exists
  * `500` → Internal server error

---

### 2. Login

* **POST** `/api/auth/login`
* **Access**: Public
* **Request Body**:

```json
{
  "username": "john",
  "password": "123456"
}
```

* **Success Response** `200`:

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "64fae1...",
    "username": "john",
    "email": "john@example.com",
    "role": "User"
  }
}
```

* **Error Responses**:

  * `400` → Invalid credentials
  * `500` → Internal server error

---

### 3. Create User (Admin Only)

* **POST** `/api/auth/create-user`
* **Access**: Protected (Admin)
* **Headers**:

  * `Authorization: Bearer <JWT_TOKEN>`
* **Request Body**: same as `register`
* **Error Responses**:

  * `401` → Unauthorized (missing/invalid token)
  * `403` → Forbidden (role not allowed)
  * `500` → Internal server error

---

## 👥 User Management API (`/api/users`)

### 1. Get All Users

* **GET** `/api/users`
* **Access**: Protected
* **Headers**:

  * `Authorization: Bearer <JWT_TOKEN>`
* **Success Response** `200`:

```json
[
  {
    "_id": "64fae1...",
    "username": "john",
    "email": "john@example.com",
    "role": "User"
  }
]
```

* **Error Responses**:

  * `401` → Unauthorized
  * `500` → Internal server error

---

### 2. Update User Role

* **PUT** `/api/users/:id/role`
* **Access**: Protected
* **Request Body**:

```json
{ "role": "Admin" }
```

* **Success Response** `200`:

```json
{
  "_id": "64fae1...",
  "username": "john",
  "email": "john@example.com",
  "role": "Admin"
}
```

* **Error Responses**:

  * `401` → Unauthorized
  * `404` → User not found
  * `500` → Internal server error

---

### 3. Delete User

* **DELETE** `/api/users/:id`
* **Access**: Protected
* **Success Response** `200`:

```json
{ "msg": "User deleted" }
```

* **Error Responses**:

  * `401` → Unauthorized
  * `404` → User not found
  * `500` → Internal server error

---

## 📊 KPI Management API (`/api/kpis`)

### 1. Get My KPIs

* **GET** `/api/kpis/my`
* **Access**: Protected
* **Success Response** `200`:

```json
[
  {
    "_id": "6501b2...",
    "title": "Increase Sales",
    "target_value": 100,
    "actual_value": 50,
    "status": "On Track",
    "assigned_user": {
      "_id": "64fae1...",
      "username": "john",
      "email": "john@example.com"
    }
  }
]
```

* **Error Responses**:

  * `401` → Unauthorized
  * `500` → Internal server error

---

### 2. Create KPI

* **POST** `/api/kpis`
* **Access**: Protected
* **Request Body**:

```json
{
  "title": "Increase Sales",
  "description": "Target sales for Q1",
  "target_value": 100,
  "assigned_user": "john",
  "start_date": "2023-10-01",
  "end_date": "2023-12-31"
}
```

* **Success Response** `201`:

```json
{
  "_id": "6501b2...",
  "title": "Increase Sales",
  "description": "Target sales for Q1",
  "target_value": 100,
  "actual_value": 0,
  "status": "On Track",
  "assigned_user": "64fae1...",
  "start_date": "2023-10-01T00:00:00.000Z",
  "end_date": "2023-12-31T00:00:00.000Z"
}
```

* **Error Responses**:

  * `400` → Validation error
  * `401` → Unauthorized
  * `500` → Internal server error

---

### 3. Get All KPIs

* **GET** `/api/kpis`
* **Access**: Protected
* **Success Response** `200`:

```json
[
  {
    "_id": "6501b2...",
    "title": "Increase Sales",
    "target_value": 100,
    "actual_value": 50,
    "status": "On Track"
  }
]
```

* **Error Responses**:

  * `401` → Unauthorized
  * `500` → Internal server error

---

### 4. Get KPI By ID

* **GET** `/api/kpis/:id`
* **Access**: Protected
* **Success Response** `200`:

```json
{
  "_id": "6501b2...",
  "title": "Increase Sales",
  "target_value": 100,
  "actual_value": 50,
  "status": "On Track"
}
```

* **Error Responses**:

  * `401` → Unauthorized
  * `404` → KPI not found
  * `500` → Internal server error

---

### 5. Update KPI

* **PUT** `/api/kpis/:id`
* **Access**: Protected
* **Rules**:

  * Admin → update any KPI
  * User → only update own KPIs
* **Request Body**:

```json
{ "actual_value": 75, "status": "At Risk" }
```

* **Success Response** `200`:

```json
{
  "_id": "6501b2...",
  "title": "Increase Sales",
  "target_value": 100,
  "actual_value": 75,
  "status": "At Risk"
}
```

* **Error Responses**:

  * `401` → Unauthorized
  * `403` → Forbidden (not owner, not admin)
  * `404` → KPI not found
  * `500` → Internal server error

---

### 6. Delete KPI

* **DELETE** `/api/kpis/:id`
* **Access**: Protected
* **Rules**:

  * Admin → delete any KPI
  * User → only delete own KPIs
* **Success Response** `200`:

```json
{ "message": "KPI deleted" }
```

* **Error Responses**:

  * `401` → Unauthorized
  * `403` → Forbidden (not owner, not admin)
  * `404` → KPI not found
  * `500` → Internal server error

---

## ⚙️ Notes

* **Authentication**: ส่ง JWT token ใน header:

```
Authorization: Bearer <JWT_TOKEN>
```

* **Role-based Access Control**:

  * **Admin**: manage all users & KPIs
  * **User**: manage only own KPIs
