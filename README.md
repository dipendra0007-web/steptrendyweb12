# StepTrendy Technologies — Full-Stack Website

A premium, futuristic, fully functional MERN-stack website for **StepTrendy Technologies Pvt. Ltd.**

## 🚀 Live Stack

- **Frontend:** React + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (with in-memory fallback via `mongodb-memory-server`)
- **Auth:** JWT
- **Email:** Nodemailer

---

## ⚡ Local Development

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure `.env`

**backend/.env**
```
MONGO_URI=mongodb://localhost:27017/steptrendy
JWT_SECRET=steptrendy_super_secret_key_2024
ADMIN_EMAIL=dipendra@steptrendy.com
ADMIN_PASSWORD=upadhayaydipendra621@@
```

**frontend/.env**
```
VITE_API_URL=/api
```

### 3. Start servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

### 4. Admin Panel

Visit: `http://localhost:5173/admin`

- **Email:** dipendra@steptrendy.com
- **Password:** upadhayaydipendra621@@

---

## 🏗️ Features

### Public Website
- ✅ Hero Section with particle canvas + TypeAnimation
- ✅ Dynamic Services (from admin)
- ✅ Portfolio gallery (filterable)
- ✅ About Us, Journey Timeline, Team
- ✅ Technologies Marquee
- ✅ Process Steps
- ✅ Testimonials (auto-play slider)
- ✅ Pricing (NPR/INR/USD)
- ✅ FAQ Accordion
- ✅ Contact Form with dynamic contact info
- ✅ Blog

### Admin Panel
- ✅ Secure JWT login
- ✅ Dashboard with analytics
- ✅ Services CRUD
- ✅ Portfolio CRUD
- ✅ Blog CRUD
- ✅ Testimonials CRUD
- ✅ About Us CRUD
- ✅ Journey/Timeline CRUD
- ✅ Tech Stack CRUD
- ✅ Process Steps CRUD
- ✅ Pricing CRUD
- ✅ FAQ CRUD
- ✅ Team Members CRUD
- ✅ Contact Inquiries + Contact Info Settings
- ✅ Social Media & Site Settings
- ✅ Newsletter Subscriptions
- ✅ Careers & Applications

---

## 📁 Project Structure

```
STEP TRENDY WEB/
├── backend/
│   ├── config/        DB + seeder
│   ├── controllers/   All CRUD controllers
│   ├── middleware/    Auth, upload, error handler
│   ├── models/        Mongoose schemas
│   ├── routes/        Express routes
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── utils/
```

---

## 🌐 Deployment

- **Frontend:** Vercel
- **Backend:** Render.com / Railway
- Set `VITE_API_URL=https://your-backend.render.com/api` in Vercel environment variables
