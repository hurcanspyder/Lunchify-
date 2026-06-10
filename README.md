# 🍱 Lunchify

> **Smart Canteen Management System for SJVN Limited**  
> Paperless lunch coupons, menu management, QR scanning, snack orders, and automated billing — all in one place.

---

## 📌 What Is This?

Lunchify replaces physical lunch tokens and paper registers at SJVN canteens. Employees use a **mobile app** to view today's menu, generate a QR code, and track their monthly coupon balance. Canteen staff scan those QR codes at the counter. At the end of the month, billing happens automatically.

---

## 🗂️ Project Structure

```
Lunchify/
├── express-backend/        # Node.js + Express REST API (the server)
├── frontend/lunchi/        # Flutter mobile app (employees & canteen admins)
├── admin-portal/           # React web app (HR Admins & IT Admins)
└── application/            # Secondary Flutter app (prototype/alternate)
```

---

## 🧩 The Three Apps

| App | Built With | Used By | Purpose |
|-----|-----------|---------|---------|
| **Mobile App** (`frontend/lunchi`) | Flutter (Dart) | Employees & Canteen Admins | View menu, generate QR, order snacks, give feedback, scan QR codes |
| **Admin Web Portal** (`admin-portal`) | React + MUI | HR Admins & IT Admins | Manage billing, approve bills, transfer employees, create accounts |
| **Backend API** (`express-backend`) | Node.js + Express | All apps connect to this | Handles all business logic, auth, database, SMS, and PDF generation |

---

## ⚡ Quick Start

### 1. Backend (Express API)

```bash
cd express-backend
npm install
```

Create a `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=lunch_app
JWT_SECRET=your_jwt_secret_here

# SMS via TextGuru (optional — falls back to console log if not set)
TEXTGURU_USERNAME=your_username
TEXTGURU_PASSWORD=your_password
TEXTGURU_SENDER_ID=SJVNIT
TEXTGURU_DLT_TEMP_ID=your_dlt_template_id
```

```bash
npm start          # production
npm run dev        # development (nodemon auto-reload)
```

Server runs on **port 3001** → `http://localhost:3001`

---

### 2. Admin Web Portal (React)

```bash
cd admin-portal
npm install
npm start
```

Runs on **port 3000** → `http://localhost:3000`

> Make sure the backend is running first. The portal currently points to `http://localhost:3001` — update `src/config.js` for production.

---

### 3. Mobile App (Flutter)

```bash
cd frontend/lunchi
flutter pub get
flutter run
```

Update the API base URL in `lib/config.dart` to point to your backend server IP.

> Requires Flutter SDK `^3.8.1`

---

## 👥 User Roles

| Role | Access |
|------|--------|
| `employee` | Mobile app — view menu, generate QR, order snacks, track coupons, give feedback |
| `canteen_admin` | Mobile app — set menu, scan QR codes, manage snack orders, generate monthly bill |
| `hr_admin` | Web portal — approve/reject bills, transfer employees, download PDF bills |
| `it_admin` | Everything — create accounts, manage projects/canteens, view all feedback and reports |

---

## 🔑 How Authentication Works

- Employees **sign up** using their Employee ID + phone number → receive an OTP via SMS → set a password
- Login issues a **JWT token** (valid 30 days) stored on the device
- **Single-device sessions** are enforced — logging in on a new device invalidates the previous session
- All API routes are protected; role checks happen server-side on every request
- Forgot password flow also uses SMS OTP

---

## 🎫 The Coupon System

- Every employee gets **16 coupons per month** (default monthly limit)
- Each QR scan at the canteen deducts **1 coupon**
- Coupons **auto-reset on the 1st of every month** — no manual action needed
- If an employee hits 0 coupons, their QR is rejected at the scanner
- Coupon counts feed directly into the canteen's monthly bill

---

## 📋 Key Features

**Employees**
- View today's food & fruit menu
- Generate a daily QR code to use at the canteen
- Track coupon balance (used / remaining / limit)
- Order snacks (morning or evening session)
- Rate individual menu items after a meal
- Submit canteen feedback with star rating

**Canteen Admin**
- Set daily food, fruit, and snack menus
- Set a weekly repeating menu template
- Scan employee QR codes at the counter
- View and manage snack orders
- View scan history (daily / monthly / yearly)
- Generate and submit monthly canteen bill

**HR Admin (web portal)**
- View all bills for their project
- Approve, reject, or flag bills for review
- Add comments to bills
- Download bills as formatted PDFs
- Transfer employees between projects

**IT Admin (web portal)**
- All HR Admin capabilities
- Create and manage all user accounts
- Create projects and canteens
- View all employee feedback and item ratings

---

## 🗄️ Database

- **MySQL** via `mysql2` connection pool
- Database name: `lunch_app` (configurable via `.env`)
- The backend includes migration scripts (`migrate.js`, `create_table.js`) for setting up tables
- Import employees from Excel using `import_employees.js`

Key tables: `users`, `food_menu`, `fruit_menu`, `snacks_menu`, `weekly_food_menu`, `weekly_fruit_menu`, `weekly_snacks_menu`, `qr_codes`, `qr_scan_logs`, `fruit_lunch_orders`, `snack_orders`, `monthly_bills`, `feedbacks`, `daily_item_feedbacks`, `transfer_requests`, `otp_verifications`, `projects`, `canteens`

---

## 📡 API Overview

All routes are prefixed with `/api/`

| Route | Purpose |
|-------|---------|
| `/api/auth` | Employee signup, login, OTP, forgot/reset password, user upsert |
| `/api/menu` | Food, fruit, snack menus (daily + weekly) |
| `/api/qr` | Generate QR, scan QR, scan history, today's status |
| `/api/snacks` | Snack catalog and snack order management |
| `/api/food-lunch` | Food lunch orders |
| `/api/fruit-lunch` | Fruit lunch orders |
| `/api/billing` | Generate bills, view bills, approve/reject, download PDF |
| `/api/transfer` | Employee project transfers, project/canteen management |
| `/api/coupons` | Coupon balance by employee ID |
| `/api/feedbacks` | Submit and view canteen feedback |
| `/api/item-feedbacks` | Submit and view per-item meal ratings |
| `/api/rooms` | Room/location data |

---

## 📲 SMS Service

Uses **TextGuru** (Indian SMS gateway) for OTP delivery. Configure via `.env`.

If `TEXTGURU_USERNAME` / `TEXTGURU_PASSWORD` are not set, the SMS is logged to the console instead — useful for local development.

Messages sent:
- `Your SJVN Lunchify signup OTP is XXXXXX. Valid for 5 minutes.`
- `Your SJVN Lunchify password reset OTP is XXXXXX. Valid for 5 minutes.`

---

## 📄 PDF Bill Generation

Monthly bills can be downloaded as PDFs by HR Admins. Generated server-side using **PDFKit**. The PDF includes bill ID, billing month, canteen name, project name, coupon count, price per coupon, total amount, status badge, and HR comments.

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_HOST` | Yes | MySQL host |
| `DB_USER` | Yes | MySQL username |
| `DB_PASSWORD` | Yes | MySQL password |
| `DB_NAME` | Yes | MySQL database name |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens |
| `TEXTGURU_USERNAME` | No | TextGuru SMS API username |
| `TEXTGURU_PASSWORD` | No | TextGuru SMS API password |
| `TEXTGURU_SENDER_ID` | No | SMS sender ID (default: `SJVNIT`) |
| `TEXTGURU_DLT_TEMP_ID` | No | DLT template ID for SMS compliance |

---

## 🔒 Security Notes

- All passwords hashed with **bcrypt** before storage
- JWT tokens checked on every protected request
- Single-device session enforcement via session token comparison
- QR codes are single-use and date-locked (expire daily)
- Database transactions used for QR scanning to prevent double-spend
- Role-based access enforced server-side on every route

> ⚠️ The current CORS config allows all origins (`origin: '*'`). Lock this down before going to production.

---

## 📁 Notable Files

```
express-backend/
├── server.js                  # App entry point, route registration
├── db.js                      # MySQL connection pool
├── middleware/
│   └── auth.middleware.js     # JWT verification + role guards
├── routes/
│   ├── login.routes.js        # Full auth flow (signup, OTP, login, forgot password)
│   ├── menu.routes.js         # All menu types (food, fruit, snacks, weekly)
│   ├── qr.routes.js           # QR generation and scanning
│   ├── billing.routes.js      # Monthly bill flow + PDF export
│   ├── transfer.routes.js     # Employee transfers + project/canteen creation
│   ├── feedback.routes.js     # Canteen-level feedback
│   └── item_feedback.routes.js# Per-item meal ratings
└── services/
    └── sms.service.js         # TextGuru SMS integration

frontend/lunchi/lib/
├── main.dart                  # App entry point
├── login_page.dart            # Login screen
├── home_page.dart             # Employee home screen
├── admin_page.dart            # Canteen admin home screen
├── qr_buy_lunch_page.dart     # QR generation for employees
├── qr_scanner.dart            # QR scanner for canteen admin
├── snack_order_employee.dart  # Employee snack ordering
└── feedback_page.dart         # Feedback submission
```

---

## 🚧 Known Limitations

- Only **one canteen per project** is supported
- No push/email notifications
- No in-app payments
- Admin web portal is **desktop-only** (not mobile-responsive)
- Snack catalog is hardcoded in the backend (not database-driven)
- No CSV/Excel report exports
- Employees must be pre-added by IT Admin before they can sign up

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile App | Flutter (Dart) |
| Web Portal | React 18 + Material UI |
| Backend | Node.js + Express 5 |
| Database | MySQL (via mysql2) |
| Auth | JWT + bcrypt |
| SMS | TextGuru API |
| PDF | PDFKit |
| QR | qrcode (generation) + mobile_scanner (scanning) |

---

*Built for internal use at SJVN Limited.*
