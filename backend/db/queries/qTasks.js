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

export async function updateTaskIsFinished(isFinished, taskId, userId) {
  const sql = `UPDATE tasks SET is_finished = $1 WHERE id = $2 AND owner_id = $3 RETURNING *`;
  const {
    rows: [task],
  } = await db.query(sql, [isFinished, taskId, userId]);

  return task;
}

export async function getTaskByTaskId(taskId) {
  const sql = `SELECT tasks.* FROM tasks WHERE id = $1 `;
  const {
    rows: [task],
  } = await db.query(sql, [taskId]);
  return task;
}
