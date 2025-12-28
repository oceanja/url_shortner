# 🔗 URL Shortener – Full Stack Web Application

A modern full-stack URL Shortener built using **Node.js, Express, PostgreSQL, React, Tailwind CSS and JWT Authentication**.  
The application allows users to securely register, login, generate short URLs, manage them in a personal dashboard and track click analytics.

---

## ✨ Features

- User Registration & Secure Login (JWT Authentication)
- Protected APIs with middleware
- Short URL generation & automatic redirection
- Click count analytics
- User-specific dashboard
- PostgreSQL persistent storage
- Responsive modern UI using Tailwind CSS

---

## 🛠 Tech Stack

| Layer | Technology |
|------|------------|
| Backend | Node.js, Express.js |
| Frontend | React (Vite), Tailwind CSS |
| Database | PostgreSQL |
| Authentication | JWT, bcrypt |
| Tools | Axios, Git, GitHub |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-link>
cd url-shortener
```

### Install Backend Dependencies
```bash
npm install
```
### Environment Setup
Create .env file in root directory:
```bash
JWT_SECRET=your_secret_key
```
### Database Setup
```bash
psql postgres
CREATE DATABASE url_shortener_db;
\q
```
### Start Backend Server
```bash
node src/index.js
```
### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### Register & Login
Register User
```bash
POST /auth/register
{
  "email": "test@gmail.com",
  "password": "test123"
}
```
### Create Short URL
Paste long URL in dashboard and click Shorten 🚀.