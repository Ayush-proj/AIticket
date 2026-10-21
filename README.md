<div align="center">

# 🎫 AIticket

**A full-stack AI-powered ticket management system** built with **Express.js** and **React + Redux Toolkit**

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

---

## Overview

**AIticket** is a role-based customer support ticketing system where:

- **Customers** can register, log in, create support tickets, and track their status.
- **Agents / Admins** can view all tickets, update statuses, and manage the queue.

Authentication is handled with **JWT** (7-day expiry), passwords are hashed with **bcrypt**, and the frontend state is managed entirely with **Redux Toolkit**.

---

## Features

| Feature | Details |
|---|---|
| 🔐 Auth | Register & Login with JWT + bcrypt |
| 🎫 Tickets | Create, view, update tickets (customer) |
| 🔍 Ticket Detail | Fetch a single ticket by ID |
| 🛡️ Role-Based Access | `customer`, `agent`, `admin` roles |
| 📋 Admin Panel | View all tickets with customer info |
| 🔄 Status Management | `open` → `in_progress` → `resolved` → `closed` |
| 🗃️ Redux State | Global auth state via Redux Toolkit slices |
| ⚡ Fast Dev | Hot-reload backend (`--watch`) + Vite HMR frontend |

---

## Tech Stack

### Backend
| Package | Version | Purpose |
|---|---|---|
| `express` | 5.x | HTTP server & routing |
| `mysql2` | 3.x | MySQL driver (promise-based) |
| `bcrypt` | 6.x | Password hashing |
| `jsonwebtoken` | 9.x | JWT generation & verification |
| `dotenv` | 18.x | Environment variable loader |
| `cors` | 2.x | Cross-origin resource sharing |

### Frontend
| Package | Version | Purpose |
|---|---|---|
| `react` | 19.x | UI library |
| `react-redux` | 9.x | Redux bindings for React |
| `@reduxjs/toolkit` | 2.x | Simplified Redux state management |
| `axios` | 1.x | HTTP client for API calls |
| `vite` | 8.x | Build tool & dev server |

---

## Project Structure

```
AIticket/
├── Backend/
│   ├── config/
│   │   └── db.js                  # MySQL connection pool
│   ├── controller/
│   │   ├── authController.js      # Register & login logic
│   │   └── ticketController.js    # CRUD + status update for tickets
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── roleMiddleware.js      # Role-based access control
│   ├── routes/
│   │   ├── authRoutes.js          # POST /api/auth/register, /login
│   │   └── ticketRoutes.js        # /api/ticket endpoints
│   ├── .env                       # ⚠️ Not committed (see below)
│   ├── express.js                 # App entry point
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── app/
    │   │   └── store.js            # Redux store
    │   ├── Features/
    │   │   └── Auth/
    │   │       └── authSlice.js    # Auth Redux slice (login / logout)
    │   ├── App.jsx                 # Root component with login form
    │   ├── main.jsx                # React entry point + Redux Provider
    │   ├── App.css
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MySQL** ≥ 8.0 running locally (or a remote host)
- **npm** ≥ 9

### Database Setup

Run the following SQL to bootstrap the schema:

```sql
CREATE DATABASE aiticket;
USE aiticket;

CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(100)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  role       ENUM('customer','agent','admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  category    VARCHAR(100),
  priority    ENUM('low','medium','high') DEFAULT 'medium',
  status      ENUM('open','in_progress','resolved','closed') DEFAULT 'open',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Backend Setup

```bash
# 1. Navigate to the backend folder
cd Backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env   # then fill in your values (see below)

# 4. Start the dev server (auto-restarts on file changes)
npm run dev
```

> Server starts at **http://localhost:3000**

### Frontend Setup

```bash
# 1. Navigate to the frontend folder
cd Frontend

# 2. Install dependencies
npm install

# 3. Start the Vite dev server
npm run dev
```

> App opens at **http://localhost:5173**

---

## Environment Variables

Create a `.env` file inside the `Backend/` folder (copy from `.env.example`):

```env
# MySQL connection
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=aiticket

# JWT
JWT_SECRET=your_super_secret_key_here
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

Create a `.env.example` as a safe template to commit:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=aiticket
JWT_SECRET=
```

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive a JWT |

**POST `/api/auth/register`** body:
```json
{
  "name": "Ayush Bhosale",
  "email": "ayush@example.com",
  "password": "secret123",
  "role": "customer"
}
```

**POST `/api/auth/login`** body:
```json
{
  "email": "ayush@example.com",
  "password": "secret123"
}
```

---

### Ticket Routes — `/api/ticket`

> All ticket routes require the `Authorization: Bearer <token>` header.

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| `POST` | `/` | `customer` | Create a new ticket |
| `GET` | `/me` | `customer` | Get my tickets |
| `GET` | `/:id` | `customer` | Get a single ticket by ID |
| `PATCH` | `/:id` | `customer` | Update ticket title/description |
| `GET` | `/all` | `agent`, `admin` | Get all tickets (with customer info) |
| `PATCH` | `/:id/status` | `agent`, `admin` | Update ticket status |

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

<div align="center">
Made with ❤️ by <a href="https://github.com/ayushbhosale">Ayush Bhosale</a>
</div>
