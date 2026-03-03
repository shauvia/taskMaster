DROP TABLE IF EXISTS project_members, project_tasks, tasks, projects, users CASCADE;


CREATE TABLE users (
    id serial PRIMARY KEY,
    username TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL, 
    is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE tasks(
    id serial PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    status TEXT,
    is_completed BOOLEAN DEFAULT false,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
    assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);



CREATE TABLE projects (
    id serial PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE project_tasks (
    id serial PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    UNIQUE (project_id, task_id)
);

CREATE TABLE project_members (
    id serial PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    member_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    UNIQUE (project_id, member_id)
);



┌─────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA                                │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│       USERS          │
├──────────────────────┤
│ id (PK)              │
│ username (UNIQUE)    │
│ password             │
│ is_deleted           │
└──────────────────────┘
         │
         │ owner_id (FK)
         ├─────────────────────────────────┐
         │                                  │
         ▼                                  ▼
┌──────────────────────┐          ┌──────────────────────┐
│       TASKS          │          │      PROJECTS        │
├──────────────────────┤          ├──────────────────────┤
│ id (PK)              │          │ id (PK)              │
│ name                 │          │ name                 │
│ description          │          │ description          │
│ start_date           │          │ owner_id (FK) ───────┼──► users.id
│ due_date             │          │ created_at           │
│ status               │          └──────────────────────┘
│ is_completed         │                   │
│ owner_id (FK) ───────┼──► users.id       │
│ assignee_id (FK) ────┼──► users.id       │
└──────────────────────┘                   │
         │                                  │
         │                                  │
         └──────────┬───────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   PROJECT_TASKS      │
         ├──────────────────────┤
         │ id (PK)              │
         │ project_id (FK) ─────┼──► projects.id
         │ task_id (FK) ────────┼──► tasks.id
         │ UNIQUE(project, task)│
         └──────────────────────┘


         ┌──────────────────────┐
         │  PROJECT_MEMBERS     │
         ├──────────────────────┤
         │ id (PK)              │
         │ project_id (FK) ─────┼──► projects.id
         │ member_id (FK) ──────┼──► users.id
         │ role                 │
         │ UNIQUE(project,member)│
         └──────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  RELATIONSHIPS:                                                          │
│  • Users create Tasks (owner_id) and Projects (owner_id)                │
│  • Users can be assigned to Tasks (assignee_id)                         │
│  • Tasks link to Projects via PROJECT_TASKS (many-to-many)              │
│  • Users join Projects via PROJECT_MEMBERS (many-to-many with role)     │
│                                                                          │
│  CASCADE RULES:                                                          │
│  • Delete User → Delete their Tasks & Projects                          │
│  • Delete Project → Delete PROJECT_TASKS & PROJECT_MEMBERS entries      │
│  • Delete Task → Delete PROJECT_TASKS entries                           │
│  • Delete User (assignee) → Set task.assignee_id to NULL               │
└─────────────────────────────────────────────────────────────────────────┘