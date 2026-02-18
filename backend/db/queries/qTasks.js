import db from "#db/client";

export async function createTask(name, description, due_date, userId) {
  const sql = `INSERT INTO tasks (name, description, due_date, owner_id) VALUES ($1, $2, $3, $4) RETURNING *`;

  const {
    rows: [task],
  } = await db.query(sql, [name, description, due_date, userId]);
  return task;
}

export async function getAllTasksByUserId(userId) {
  const sql = `SELECT tasks.*
    FROM tasks WHERE tasks.id NOT IN (SELECT task_id FROM project_tasks) AND owner_id = $1 ORDER BY id`;

  const { rows: tasks } = await db.query(sql, [userId]);
  return tasks;
}

export async function updateTask(name, description, due_date, taskId, userId) {
  const sql = `UPDATE tasks SET name = $1, description = $2, due_date = $3 WHERE id = $4 AND owner_id = $5 RETURNING *`;

  const {
    rows: [task],
  } = await db.query(sql, [name, description, due_date, taskId, userId]);
  return task;
}

export async function deleteTask(taskId, userId) {
  const sql = `DELETE FROM tasks WHERE id = $1 AND owner_id = $2 RETURNING *`;

  const {
    rows: [task],
  } = await db.query(sql, [taskId, userId]);
  return task;
}

export async function updateTaskIsCompleted(isCompleted, taskId) {
  const sql = `UPDATE tasks SET is_completed = $1 WHERE id = $2 RETURNING *`;
  const {
    rows: [task],
  } = await db.query(sql, [isCompleted, taskId]);
  return task;
}

export async function getTaskByTaskId(taskId) {
  const sql = `SELECT tasks.* FROM tasks WHERE id = $1 `;
  const {
    rows: [task],
  } = await db.query(sql, [taskId]);
  return task;
}

// For later

// Get all tasks for projects where user is a member
export async function getTasksForMember(userId) {
  const sql = `
    SELECT DISTINCT tasks.*, projects.name as project_name 
    FROM tasks
    JOIN project_tasks ON project_tasks.task_id = tasks.id
    JOIN projects ON projects.id = project_tasks.project_id
    JOIN project_members ON project_members.project_id = projects.id
    WHERE project_members.member_id = $1
    ORDER BY tasks.id ASC
  `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

// Get tasks assigned to a specific user in a project
export async function getAssignedTasksInProject(projectId, userId) {
  const sql = `
    SELECT tasks.* 
    FROM tasks
    JOIN project_tasks ON project_tasks.task_id = tasks.id
    WHERE project_tasks.project_id = $1 
    AND tasks.assignee_id = $2
    ORDER BY tasks.id ASC
  `;
  const { rows } = await db.query(sql, [projectId, userId]);
  return rows;
}
