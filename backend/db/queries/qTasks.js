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

export async function getTaskByIdAndMemberId(taskId, memberId) {
  const sql = `SELECT tasks.* FROM tasks WHERE id = $1 AND assignee_id = $2`;
  const {
    rows: [task],
  } = await db.query(sql, [taskId, memberId]);
  return task;
}
export async function getTasksByAssigneeId(assigneeId) {
  const sql = `SELECT tasks.* FROM tasks WHERE assignee_id = $1 ORDER BY due_date`;
  const { rows: tasks } = await db.query(sql, [assigneeId]);
  return tasks;
}

export async function getTasksDueSoonForReminder() {
  const sql = `SELECT tasks.id, tasks.name, tasks.description, tasks.due_date, tasks.assignee_id, 
  COALESCE(assignee.email, owner.email) AS reminder_email, 
  COALESCE(assignee.username, owner.username) AS reminder_username
  FROM tasks
  JOIN users owner ON owner.id = tasks.owner_id
  LEFT JOIN users assignee ON assignee.id = tasks.assignee_id
  WHERE tasks.is_completed = false
  AND tasks.due_date IS NOT NULL
  AND tasks.due_date >= CURRENT_DATE
  AND tasks.due_date < CURRENT_DATE + INTERVAL '1 day'
  AND (tasks.reminder_sent_at IS NULL OR tasks.reminder_sent_at < CURRENT_DATE)
  AND COALESCE(assignee.email_verified, owner.email_verified) = true
  AND COALESCE(assignee.is_deleted, owner.is_deleted) = false `;
  const { rows } = await db.query(sql);
  return rows;
}

// returns:{
//   id: number,
//   name: string,
//   description: string | null,
//   due_date: date,
//   owner_id: number,
//   assignee_id: number | null,
//   reminder_email: string,
//   reminder_username: string }

// JOIN users owner (inner JOIN) ON owner.id = tasks.owner_id means: create temporary
// owner table alias (column? name) and returns it because owner_id always exists (not NULL)

// LEFT JOIN users assignee ON assignee.id = tasks.assignee_id means: create temporary

//COALESCE(assignee.email, owner.email) means: if assignee.email is not NULL, return it, otherwise return owner.email.
// This way we can get the email of the person to remind,
// whether it's the assignee or the owner (if no assignee).

export async function markReminderSent(taskId) {
  const sql = `UPDATE tasks SET reminder_sent_at = NOW() WHERE id = $1 RETURNING *`;
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
