
---

```markdown
# 📝 Task Management WebApp

A full-stack task management system with secure authentication, OTP verification, Google OAuth 2.0 login, role-based access control, and task CRUD operations. Built using **React + Vite (Frontend)** and **Node.js/Express + MongoDB (Backend)**.

---

## 🚀 Features

### 🔐 Authentication
- Email/password login & signup with OTP email verification
- Google OAuth 2.0 login via `@react-oauth/google`
- JWT-based token authentication (stored in cookies)
- Protected API routes and pages

### 👤 User Management
- Admin and User roles
- Soft delete (deactivate) users
- Edit and view users
- Secure password hashing with bcrypt

### ✅ Task Management
- Create, update, delete, and search tasks
- Sort and filter by status, priority, and date
- PDF export for task lists

---

## 📁 Project Structure

```
├── backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── .env
│   └── server.js
├── frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
└── README.md

````

---

## ⚙️ Tech Stack

- **Frontend**: React + Vite, Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Nodemailer
- **Authentication**: Google OAuth 2.0, OTP Email Verification
- **Tools**: PDF Generation, Role-based middleware

---

## 🛠️ Getting Started

### ✅ Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account
- Gmail account (for sending OTPs)
- Google Cloud Console OAuth client ID

---

### 📦 Backend Setup

```bash
cd backend
npm install
````

Create a `.env` file in the `backend/` directory:

```env
PORT=8080
MONGODB_URL=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
SALT_ROUNDS=10
GOOGLE_CLIENT_ID=your_google_client_id
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
```

Start the backend server:

```bash
npm run dev
```

---

### 🌐 Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the frontend server:

```bash
npm run dev
```

---

## 🔐 Authentication Flow

### Signup (Manual)

1. User enters email → receives OTP
2. Verifies OTP → account is created
3. Can now login with email/password

### Login (Google)

1. Clicks "Sign in with Google"
2. JWT is issued after backend verification
3. Redirected to dashboard

---

## 🧪 API Endpoints

### Auth Routes

* `POST /api/v1/auth/signup`
* `POST /api/v1/auth/send-otp`
* `POST /api/v1/auth/verify-otp`
* `POST /api/v1/auth/login`
* `POST /api/v1/auth/google-login`

### User Routes

* `GET /api/v1/users/`
* `PATCH /api/v1/users/:id`
* `DELETE /api/v1/users/:id`

### Task Routes

* `GET /api/v1/tasks/`
* `POST /api/v1/tasks/`
* `PATCH /api/v1/tasks/:id`
* `DELETE /api/v1/tasks/:id`

---

## ✨ Future Improvements

* Password reset via email
* Task calendar and reminders
* Notification system
* Dark mode support

---



## 🙋‍♂️ Author

Made with ❤️ by **Pamudu_Wijayabandara** – [GitHub](https://github.com/Pamudu22)

```

---

Let me know if you want to:
- Add **deployment instructions** (e.g., Vercel/Render/MongoDB Atlas)
- Include **screenshots or badges**
- Write a **contribution guide or changelog**
```
