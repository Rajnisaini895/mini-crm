# 🎯 Mini CRM Opportunity Tracker

A secure, full-stack MERN web application for managing a shared CRM-style sales opportunity pipeline. Built for startups, sales teams, and SMEs to track leads, follow-ups, and deal stages.

---

## 🚀 Live Demo

- **Frontend:** https://mini-crm-frontend.vercel.app  
- **Backend API:** https://mini-crm-backend.onrender.com  
- **Test Credentials:** Register a new account directly on the app

---

## ✨ Features

- 🔐 JWT-based authentication (register, login, auto-login)
- 🔒 bcrypt password hashing
- 👤 Ownership-based authorization — only creators can edit/delete their opportunities
- 📊 Shared pipeline dashboard — all users see all opportunities
- 🔍 Filter by stage, priority, and search by customer name
- 📈 Summary cards: Total, Pipeline Value, Won Deals, High Priority
- ✅ Full CRUD for opportunities with form validation
- 🚫 Backend ownership validation (cannot be bypassed from frontend)
- 📱 Responsive design with Tailwind CSS
- 🍞 Toast notifications for all actions

---

## 🛠️ Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 18 (Vite), React Router DOM, Axios, Tailwind CSS |
| Backend    | Node.js, Express.js                         |
| Database   | MongoDB Atlas, Mongoose                     |
| Auth       | JWT, bcryptjs                               |
| Validation | express-validator (backend), custom (frontend) |
| Deployment | Vercel (frontend), Render (backend)         |

---

## 📁 Project Structure

```
mini-crm/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── opportunityController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Opportunity.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── opportunityRoutes.js
│   │   ├── utils/generateToken.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── OpportunityCard.jsx
    │   │   ├── OpportunityForm.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CreateOpportunity.jsx
    │   │   ├── EditOpportunity.jsx
    │   │   └── ViewOpportunity.jsx
    │   ├── services/api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

---

## ⚙️ Backend Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/your-username/mini-crm.git
cd mini-crm/backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Then edit .env with your values

# 4. Start development server
npm run dev
```

The backend runs on `http://localhost:5000`

---

## 🖥️ Frontend Setup

```bash
cd mini-crm/frontend

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api

# 3. Start development server
npm run dev
```

The frontend runs on `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mini-crm
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=2h
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Documentation

### Base URL
`/api`

### Authentication

| Method | Endpoint            | Access  | Body                          | Returns              |
|--------|---------------------|---------|-------------------------------|----------------------|
| POST   | `/auth/register`    | Public  | `name, email, password`       | `token, user`        |
| POST   | `/auth/login`       | Public  | `email, password`             | `token, user`        |
| GET    | `/auth/me`          | Private | —                             | User object          |

### Opportunities

| Method | Endpoint                  | Access        | Notes                                  |
|--------|---------------------------|---------------|----------------------------------------|
| GET    | `/opportunities`          | Private       | Supports `?stage=&priority=&search=`   |
| POST   | `/opportunities`          | Private       | `owner` set from JWT — never from body |
| GET    | `/opportunities/:id`      | Private       | Single opportunity                     |
| PUT    | `/opportunities/:id`      | Owner only    | 403 if not owner (backend enforced)    |
| DELETE | `/opportunities/:id`      | Owner only    | 403 if not owner (backend enforced)    |

### Query Params for GET `/opportunities`
- `stage` — Filter by stage (New, Contacted, Qualified, Proposal Sent, Won, Lost)
- `priority` — Filter by priority (Low, Medium, High)
- `search` — Search by customer name (case-insensitive)
- `sortBy` — Sort field (createdAt, estimatedValue, nextFollowUpDate)
- `order` — asc or desc (default: desc)

---

## 🚀 Deployment Guide

### 1. MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Add a database user and whitelist `0.0.0.0/0` for all IPs
3. Copy the connection string into your backend `.env` as `MONGO_URI`

### 2. Backend → Render
1. Push your code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repo, set root directory to `backend`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables (MONGO_URI, JWT_SECRET, CLIENT_URL, NODE_ENV=production)
7. Deploy — note your Render URL (e.g. `https://mini-crm-backend.onrender.com`)

### 3. Frontend → Vercel
1. Create a new project on [vercel.com](https://vercel.com)
2. Connect your GitHub repo, set root directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://mini-crm-backend.onrender.com/api`
4. Deploy — note your Vercel URL
5. Go back to Render and update `CLIENT_URL` to your Vercel URL

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt (salt rounds: 12)
- JWT tokens expire in 2 hours
- `owner` field is always derived from JWT — never accepted from request body
- Backend enforces ownership validation on all PUT/DELETE routes (returns 403)
- JWT secret and DB credentials stored only in environment variables
- Password field excluded from all query responses (`select: false`)

---

## 📋 Known Limitations / Future Improvements

- [ ] Pagination for large opportunity lists
- [ ] Kanban board view (drag-and-drop by stage)
- [ ] Email notifications for follow-up dates
- [ ] Activity log / history per opportunity
- [ ] Role-based access (admin vs. sales rep)
- [ ] Unit and integration tests
- [ ] Docker setup for local development
- [ ] Refresh token mechanism for longer sessions

---

## 👩‍💻 Author

Built by **Rajni Saini** as part of the CEOFactory MERN Stack Developer Assignment.

- GitHub: [github.com/Rajnisaini895](https://github.com/Rajnisaini895)
- LinkedIn: [linkedin.com/in/rajni-saini](https://linkedin.com/in/rajni-saini)
