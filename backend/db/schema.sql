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



