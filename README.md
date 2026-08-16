# TaskFlow – Task Management Application

## Project Overview

TaskFlow is a full-stack task management application built for learning and practicing modern frontend and backend development.

The application allows users to register, log in, and manage their personal tasks through a web dashboard. Each authenticated user can only access and manage tasks belonging to their own account.

Users can:

* Create tasks
* View tasks
* Update tasks
* Delete tasks
* Search tasks
* Filter tasks by status
* Log out

## Architecture

```text
┌──────────────┐
│     User     │
│ Web Browser  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│    Next.js Frontend      │
│                          │
│  React + TypeScript      │
│  Tailwind CSS            │
│                          │
│  Login / Register        │
│  Task Dashboard          │
└────────────┬─────────────┘
             │
             │ REST API
             ▼
┌──────────────────────────┐
│     FastAPI Backend      │
│                          │
│  Authentication          │
│  JWT Authorization       │
│  Task CRUD               │
│  Search & Filtering      │
│  Pydantic Validation     │
└────────────┬─────────────┘
             │
             │ SQLAlchemy ORM
             ▼
┌──────────────────────────┐
│       PostgreSQL         │
│                          │
│       Users Table        │
│       Tasks Table        │
└──────────────────────────┘
```

## Tech Stack

| Category                | Technologies                                   |
| ----------------------- | ---------------------------------------------- |
| **Frontend**            | Next.js, React, TypeScript, Tailwind CSS       |
| **Backend**             | Python, FastAPI, Pydantic, SQLAlchemy, Uvicorn |
| **Database**            | PostgreSQL                                     |
| **Authentication**      | JWT, bcrypt                                    |
| **Tools & Environment** | Node.js, npm, python-dotenv                    |

## Outcomes

Through this project, I practiced:

* Building a full-stack web application
* Creating and integrating REST APIs
* Implementing user registration and login
* Using JWT-based authentication and authorization
* Securing passwords with bcrypt hashing
* Performing CRUD operations
* Implementing search and task status filtering
* Managing user-task relationships with PostgreSQL
* Using SQLAlchemy ORM for database operations
* Validating backend data with Pydantic
* Building a responsive frontend with Next.js, TypeScript, and Tailwind CSS
* Connecting a frontend application with a FastAPI backend
