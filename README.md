# 🗝️ Asset Valet v3 — Complete Asset Management System

## ✅ What's Working
- Sign Up & Sign In (JWT auth, role-based)
- Admin: Dashboard, Assets, Employees, Assignments, Reports
- All pages: Add ✅ · Delete ✅ · Update status ✅
- Rich dummy data (8 users, 20 assets, 8 reports)
- Employee: My Assets, Report Issue, View own reports

---

## ⚡ Setup (5 Steps)

### 1. Create PostgreSQL Database
```powershell
# Find PostgreSQL (check your version: 14, 15, 16, 17)
cd "C:\Program Files\PostgreSQL\16\bin"
psql -U postgres -c "CREATE DATABASE asset_valet;"
```

### 2. Edit .env.local
Open `.env.local` and set your PostgreSQL password:
```
DB_PASSWORD=your_actual_password_here
```

### 3. Install Dependencies
```powershell
npm install
```

### 4. Seed Database
```powershell
npm run db:setup
```
This creates all tables and inserts 8 users, 20 assets, 10 assignments, 8 reports.

### 5. Start the App
```powershell
npm run dev
```
Open: **http://localhost:3000**

---

## 🔐 Login Credentials

| Role     | Username       | Password   |
|----------|---------------|------------|
| **Admin**    | `admin`       | `Admin@123` |
| **Employee** | `sara.khan`   | `Pass@123`  |
| **Employee** | `john.doe`    | `Pass@123`  |
| **Employee** | `priya.sharma`| `Pass@123`  |
| **Employee** | `mike.chen`   | `Pass@123`  |

Or **Sign Up** at http://localhost:3000/signup to create your own account.

---

## 📋 Feature Checklist

### Auth
- [x] Sign Up (choose admin or employee role)
- [x] Sign In with validation
- [x] JWT sessions (8 hours)
- [x] Role-based routing (middleware)
- [x] Sign Out

### Admin Dashboard
- [x] Overview stats (assets, employees, assignments, open reports)
- [x] Asset health bar chart
- [x] Recent assets table
- [x] Recent reports panel

### Assets Page
- [x] View all assets with full details
- [x] Filter by status (available, assigned, damaged, etc.)
- [x] Search by name, type, brand, serial number
- [x] Add new asset (with brand, model, price, location)
- [x] Delete asset

### Employees Page
- [x] View all employees as cards
- [x] Search employees
- [x] Add new employee (with department)
- [x] Delete employee (auto-returns their assets)

### Assignments Page
- [x] View active assignments
- [x] View assignment history
- [x] Assign asset to employee
- [x] Return asset

### Reports Page
- [x] View all reports with stats
- [x] Filter by condition & status
- [x] Search reports
- [x] Update report status (open → pending → resolved)
- [x] **Delete report** ← new!
- [x] Colored badges for all conditions

### Employee Dashboard
- [x] My assigned assets table
- [x] Summary cards (assigned, reports, resolved)
- [x] My recent reports list
- [x] Report Issue form (4 condition types)
- [x] Success confirmation after submitting

---

## 🏗️ Project Structure
```
asset-valet/
├── app/
│   ├── api/
│   │   ├── auth/login|logout|signup   ← Auth APIs
│   │   ├── assets/                    ← GET,POST,PATCH,DELETE
│   │   ├── employees/                 ← GET,POST,DELETE
│   │   ├── assignments/               ← GET,POST,DELETE
│   │   ├── reports/                   ← GET,POST,PATCH,DELETE
│   │   └── dashboard/                 ← Stats API
│   ├── login/         ← Sign In
│   ├── signup/        ← Sign Up
│   ├── dashboard/     ← Admin pages
│   └── employee/      ← Employee pages
├── components/
│   ├── admin/AdminSidebar.tsx
│   └── employee/EmployeeSidebar.tsx
├── lib/
│   ├── db.ts          ← PostgreSQL connection
│   └── auth.ts        ← JWT utilities
├── db/
│   ├── schema.sql     ← Tables + dummy data
│   └── setup.js       ← One-command setup
├── middleware.ts       ← Route protection
└── .env.local          ← DB config (edit this!)
```
