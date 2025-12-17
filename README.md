# Employee Management System

A full-stack MERN application for managing employees and departments.

## Features
- **Employee Management**: Create, Read, Update, Delete employees.
- **Department Management**: Create, Read, Update, Delete departments.
- **Search & Filter**: Search employees by name and filter by department.
- **Pagination**: Efficiently handle large lists of employees.
- **Authentication**: JWT-based authentication with Role-Based Access Control (Admin/User).
- **File Upload**: Upload profile photos for employees.
- **Dashboard**: Admin dashboard with quick links.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Multer, JWT.
- **Database**: MongoDB (Dockerized).

## Prerequisites
- Node.js (v14+)
- Docker & Docker Compose (for MongoDB)

## Setup & Installation

### 1. Database Setup
Start the MongoDB container:
```bash
docker-compose up -d
```

### 2. Backend Setup
Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `server` directory (already provided in the code, but ensure it exists):
```env
PORT=5000
MONGO_URI=mongodb://admin:password@localhost:27017/alobha_db?authSource=admin
JWT_SECRET=supersecretkey123
```

Start the server:
```bash
npm run dev
```
The server runs on `http://localhost:5000`.

### 3. Frontend Setup
Navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The application runs on `http://localhost:5173`.

## Usage
1.  Open the frontend URL.
2.  Register a new account (select 'Admin' role to test full features).
3.  Login with your credentials.
4.  Navigate to Departments to add some departments first.
5.  Navigate to Employees to add employees.

## API Endpoints

### Auth
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login user.

### Departments
- `GET /api/departments`: Get all departments.
- `POST /api/departments`: Create a department (Admin only).
- `PUT /api/departments/:id`: Update a department (Admin only).
- `DELETE /api/departments/:id`: Delete a department (Admin only).

### Employees
- `GET /api/employees`: Get employees (supports pagination `?pageNumber=1`, search `?keyword=abc`, filter `?department=id`).
- `GET /api/employees/:id`: Get single employee.
- `POST /api/employees`: Create employee (Admin only, supports `multipart/form-data`).
- `PUT /api/employees/:id`: Update employee (Admin only, supports `multipart/form-data`).
- `DELETE /api/employees/:id`: Delete employee (Admin only).
