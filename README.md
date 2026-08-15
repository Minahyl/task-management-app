# TaskFlow – Task Management Application

> **Learning & Practice Project**
>
> TaskFlow is a full-stack task management application built for learning and practicing modern frontend and backend development. It is a small personal project rather than a production-scale system.

---

## 📌 Project Overview

TaskFlow allows users to securely create and manage their own tasks through a modern web dashboard.

A user must first log in. If they are a new user, they can register an account and then log in. After successful authentication, they are taken to their personal dashboard where they can:

- Create tasks
- View their tasks
- Update tasks
- Delete tasks
- Search tasks
- Filter tasks by status
- Log out

Each authenticated user can only access the tasks belonging to their own account. Task ownership is enforced by the FastAPI backend using the authenticated user's ID.

---

## ✨ Main Features

### 🔐 Authentication

- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected task endpoints
- Logout by removing the stored authentication token

### 📝 Task Management

- Create a task
- View all personal tasks
- View a single task
- Update a task
- Delete a task
- Search by title or description
- Filter by task status

### 📊 Task Status

Tasks can have one of three statuses:

- `pending`
- `in_progress`
- `completed`

---

# 🏗️ Application Architecture

```text
                         ┌─────────────────────────┐
                         │          USER           │
                         │      Web Browser        │
                         └────────────┬────────────┘
                                      │
                                      ▼
                    ┌──────────────────────────────┐
                    │       NEXT.JS FRONTEND       │
                    │                              │
                    │  React + TypeScript          │
                    │  Tailwind CSS                │
                    │                              │
                    │  ┌────────────────────────┐  │
                    │  │ Authentication         │  │
                    │  │ Login / Register       │  │
                    │  └────────────────────────┘  │
                    │                              │
                    │  ┌────────────────────────┐  │
                    │  │ Dashboard              │  │
                    │  │ Create / Update /      │  │
                    │  │ Delete / Search Tasks  │  │
                    │  └────────────────────────┘  │
                    └──────────────┬───────────────┘
                                   │
                              HTTP REST API
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │       FASTAPI BACKEND        │
                    │                              │
                    │  Python + FastAPI             │
                    │  Uvicorn                     │
                    │                              │
                    │  ┌────────────────────────┐  │
                    │  │ Authentication Routes  │  │
                    │  │ Register / Login       │  │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │              ▼               │
                    │       JWT Authentication     │
                    │              │               │
                    │  ┌──────────▼────────────┐  │
                    │  │ Task Routes            │  │
                    │  │ CRUD / Search / Filter│  │
                    │  └──────────┬─────────────┘  │
                    │             │                │
                    │  ┌──────────▼─────────────┐  │
                    │  │ User Authorization      │  │
                    │  │ Current Logged-in User │  │
                    │  └──────────┬─────────────┘  │
                    └─────────────┼────────────────┘
                                  │
                             SQLAlchemy ORM
                                  │
                                  ▼
                    ┌──────────────────────────────┐
                    │        POSTGRESQL            │
                    │          DATABASE            │
                    │                              │
                    │   ┌──────────┐ ┌──────────┐  │
                    │   │  Users   │ │  Tasks   │  │
                    │   └────┬─────┘ └────┬─────┘  │
                    │        │             │        │
                    │        └──────┬──────┘        │
                    │               │               │
                    │          user_id FK           │
                    └──────────────────────────────┘
```

---

# 🔄 User & Authentication Flow

```text
                    ┌──────────────┐
                    │    Visitor   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │     Login    │
                    └──────┬───────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
             New User           Existing User
                 │                   │
                 ▼                   │
            ┌──────────┐             │
            │ Register │             │
            └────┬─────┘             │
                 │                   │
                 └─────────┬─────────┘
                           ▼
                    ┌──────────────┐
                    │     Login    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  JWT Token   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Dashboard   │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
        Create /       Search /       Update /
        View Tasks     Filter Tasks   Delete Tasks
                           │
                           ▼
                         Logout
```

---

# 🔒 User-Specific Task Authorization

A key part of the project is that users should not see another user's tasks.

When a logged-in user requests their tasks, the backend gets the user's ID from the JWT token and filters the database query using that ID.

Conceptually:

```text
JWT Token
    │
    ▼
Current User ID
    │
    ▼
Task Query
    │
    ▼
WHERE task.user_id = current_user.id
    │
    ▼
Only that user's tasks
```

This means the frontend does not simply hide other users' tasks. The backend also checks task ownership.

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework |
| React | UI development |
| TypeScript | Type-safe JavaScript |
| Tailwind CSS | Styling and responsive UI |
| Node.js | Runtime/tooling for the Next.js application |
| npm | Package management |

## Backend

| Technology | Purpose |
|---|---|
| Python | Backend programming language |
| FastAPI | REST API framework |
| Uvicorn | ASGI server used to run FastAPI |
| Pydantic | Request data validation |
| SQLAlchemy | ORM for database operations |
| PostgreSQL | Relational database |
| python-jose | JWT creation and verification |
| Passlib | Password hashing utilities |
| bcrypt | Password hashing algorithm |
| python-dotenv | Loading environment variables |

---

# 📁 Project Structure

```text
task-management-app/
│
├── README.md
│
├── backend/
│   │
│   ├── main.py
│   ├── auth.py
│   ├── auth_routes.py
│   ├── database.py
│   ├── models.py
│   ├── models_user.py
│   ├── security.py
│   ├── requirements.txt
│   ├── .env
│   └── venv/
│
└── frontend/
    │
    ├── app/
    │   ├── login/
    │   │   └── page.tsx
    │   │
    │   ├── register/
    │   │   └── page.tsx
    │   │
    │   ├── dashboard/
    │   │   └── page.tsx
    │   │
    │   ├── page.tsx
    │   ├── layout.tsx
    │   └── globals.css
    │
    ├── components/
    │   ├── auth/
    │   ├── dashboard/
    │   └── ui/
    │
    ├── lib/
    │
    ├── types/
    │
    ├── public/
    │
    ├── package.json
    ├── tsconfig.json
    └── ...
```

> The exact frontend component names may change as the UI is developed. The structure above represents the project's main organization.

---

# 🔙 Backend Structure & Responsibilities

### `main.py`

Main FastAPI application.

Handles:

- FastAPI app creation
- Authentication router registration
- Task endpoints
- Task validation
- Task CRUD operations
- Search and status filtering

### `auth_routes.py`

Contains authentication endpoints:

```text
POST /auth/register
POST /auth/login
```

Responsible for:

- Registering users
- Checking duplicate emails
- Verifying login credentials
- Returning JWT access tokens

### `auth.py`

Responsible for JWT authentication.

Handles:

- JWT creation
- JWT verification
- Token expiration
- Getting the current authenticated user

### `security.py`

Responsible for password security.

Handles:

- Password hashing
- Password verification

Passwords are not stored as plain text.

### `database.py`

Responsible for:

- PostgreSQL connection
- SQLAlchemy engine
- Database sessions
- SQLAlchemy declarative base

### `models_user.py`

Defines the `User` database model.

Main fields:

```text
id
name
email
password_hash
```

A user can have multiple tasks.

### `models.py`

Defines the `Task` database model.

Main fields:

```text
id
title
description
status
user_id
```

`user_id` connects each task to its owner.

---

# 🗄️ Database Relationship

```text
┌─────────────────────┐
│        users        │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email               │
│ password_hash       │
└──────────┬──────────┘
           │
           │ 1 : many
           │
           ▼
┌─────────────────────┐
│        tasks        │
├─────────────────────┤
│ id (PK)             │
│ title               │
│ description         │
│ status              │
│ user_id (FK)        │
└─────────────────────┘
```

One user can have many tasks.

Each task belongs to one user through `user_id`.

---

# 🔌 API Endpoints

## Authentication

### Register

```http
POST /auth/register
```

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```http
POST /auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

The login response contains a JWT access token.

---

## Tasks

All task endpoints require authentication using:

```http
Authorization: Bearer <access_token>
```

### Get Tasks

```http
GET /tasks
```

Optional query parameters:

```text
?search=project
?status=pending
```

### Get Single Task

```http
GET /tasks/{task_id}
```

### Create Task

```http
POST /tasks
```

Example:

```json
{
  "title": "Complete project",
  "description": "Finish the task management project",
  "status": "pending"
}
```

### Update Task

```http
PUT /tasks/{task_id}
```

### Delete Task

```http
DELETE /tasks/{task_id}
```

---

# 🔐 Authentication Details

The project uses JWT-based authentication.

```text
User Login
    │
    ▼
FastAPI verifies email/password
    │
    ▼
Password verified using bcrypt
    │
    ▼
JWT access token created
    │
    ▼
Frontend receives token
    │
    ▼
Frontend sends:
Authorization: Bearer <token>
    │
    ▼
FastAPI verifies token
    │
    ▼
Current user identified
    │
    ▼
Protected task operation allowed
```

The JWT contains the user's ID and an expiration time.

---

# 🎨 Frontend Design

The frontend was designed with a modern SaaS-style interface with a premium visual direction.

Main design goals:

- Clean interface
- Glassmorphism elements
- Soft backgrounds
- Blue-based visual theme
- Subtle borders
- Rounded cards
- Responsive layout
- Dashboard-focused experience
- Simple task management interactions

The design focuses on keeping the application visually polished while remaining suitable for a learning project.

---

# 🚀 Running the Project Locally

## 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd task-management-app
```

---

## 2. Backend Setup

Go to the backend:

```bash
cd backend
```

Create/activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
DATABASE_URL=your_postgresql_connection_string
```

Run FastAPI:

```bash
uvicorn main:app --reload
```

Backend will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Next.js application will normally be available at:

```text
http://localhost:3000
```

---

# 🌐 Deployment

The frontend can be deployed using **Vercel**.

The FastAPI backend is a separate Python application and needs Python/ASGI-compatible hosting.

Typical deployment architecture:

```text
                   Internet
                      │
             ┌────────▼────────┐
             │     Vercel      │
             │  Next.js App    │
             └────────┬────────┘
                      │
                  REST API
                      │
             ┌────────▼────────┐
             │ Python Hosting  │
             │ FastAPI +       │
             │ Uvicorn         │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │   PostgreSQL    │
             └─────────────────┘
```

> The actual hosting provider for the FastAPI backend can be selected separately from the frontend deployment.

---

# 🔐 Environment Variables

Do not commit secret values to GitHub.

Example:

```env
DATABASE_URL=your_database_url
```

If the project uses a JWT secret stored through environment variables, keep that secret outside the repository as well.

The `.env` file should normally be included in `.gitignore`.

---

# 🎯 Learning Goals

This project was created mainly for **learning and practice purposes**.

It helped practice:

- Full-stack application structure
- REST API development
- FastAPI
- Authentication
- JWT tokens
- Password hashing
- Pydantic validation
- SQLAlchemy ORM
- PostgreSQL
- CRUD operations
- User-based authorization
- Search and filtering
- Next.js
- React
- TypeScript
- Tailwind CSS
- Frontend/backend API communication
- Basic deployment concepts
- Git and GitHub workflow

---

# 📚 What I Learned

Through this project, I practiced how a frontend application communicates with a backend API and how authenticated users can interact with their own database records.

The project also helped me understand the relationship between:

```text
Frontend
   ↓
REST API
   ↓
Authentication
   ↓
Backend Logic
   ↓
ORM
   ↓
Database
```

---

# 📌 Project Scope

This is a **learning and practice project**, not a large production-level task management platform.

The focus was on understanding the fundamentals of:

- Authentication
- Authorization
- CRUD
- Database relationships
- API integration
- Frontend development
- Full-stack project organization

Some advanced production features such as complex role management, refresh-token rotation, advanced validation, automated testing, monitoring, and large-scale infrastructure are outside the current scope.

---

# 👩‍💻 Author

**Manahil Shah**

Computer Science Student  
Frontend Developer / Full-Stack Learner

---

# 📄 License

This project was created for learning and practice purposes.
