# TaskMaster

A task management app with user auth, personal tasks, and collaborative projects.

## Features
- Register/Login with hashed passwords and JWT auth
- Create, edit, delete tasks with due dates and descriptions
- Mark tasks complete
- Create projects, add members, and share tasks
- Permissions: creators can edit; members can mark complete

## Tech Stack
- Frontend: React, React Router, Vite
- Backend: Node.js, Express
- Database: PostgreSQL

## Project Structure
- `frontend/` – React client
- `backend/` – Express API + DB

## Getting Started

### Prerequisites
- Node.js >= 22
- PostgreSQL

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` in `backend/`:
```
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/taskmaster_db
JWT_SECRET=your_secret
PORT=3001
```

Initialize the database:
```bash
npm run db:schema
npm run db:seed
```

Start the API:
```bash
npm run dev
```

### Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

## Scripts (Backend)
- `npm run dev` – start server with watch
- `npm run start` – start server
- `npm run db:schema` – run schema
- `npm run db:seed` – seed data
- `npm run db:reset` – reset + seed

## Notes
- Group tasks are visible to all project members.
- Permissions: creator can edit; members can mark complete.
