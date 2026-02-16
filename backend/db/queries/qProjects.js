import db from "#db/client";

export async function createProject(name, description, ownerId) {
  const sql = `INSERT INTO projects (name, description, owner_id) VALUES 
    ($1, $2, $3) RETURNING *`;

  const {
    rows: [project],
  } = await db.query(sql, [name, description, ownerId]);

  return project;
}

export async function createProjectTask(
  name,
  description,
  due_date,
  userId,
  assigneeId,
) {
  const sql = `INSERT INTO tasks (name, description, due_date, owner_id, assignee_id) VALUES 
    ($1, $2, $3, $4, $5) RETURNING *`;
  const {
    rows: [task],
  } = await db.query(sql, [name, description, due_date, userId, assigneeId]);

  return task;
}

// export async function getOneProjectTaskById(taskId) {
//   const sql = `SELECT * FROM tasks WHERE id = $1`;
//   const {
//     rows: [task],
//   } = await db.query(sql, [taskId]);

//   return task;
// } ???????????????????

export async function updateProjectTask(
  name,
  description,
  due_date,
  userId,
  assigneeId,
  taskId,
) {
  const sql = `UPDATE tasks SET name = $1, description = $2, due_date = $3, owner_id = $4, assignee_id = $5 WHERE id = $6 RETURNING *`;
  const {
    rows: [task],
  } = await db.query(sql, [
    name,
    description,
    due_date,
    userId,
    assigneeId,
    taskId,
  ]);

  return task;
}

export async function linkTaskToProject(projectId, taskId) {
  const sql = `INSERT INTO project_tasks (project_id, task_id) VALUES ($1, $2) RETURNING *`;
  const {
    rows: [projectTask],
  } = await db.query(sql, [projectId, taskId]);

  return projectTask;
}

export async function linkMemberToProject(
  projectId,
  memberId,
  role = "member",
) {
  const sql = `INSERT INTO project_members (project_id, member_id, role) VALUES ($1, $2, $3) RETURNING *`;
  const {
    rows: [projectMember],
  } = await db.query(sql, [projectId, memberId, role]);

  return projectMember;
}

export async function getProjectMemberByMemberAndProjectId(
  memberId,
  projectId,
) {
  const sql = `SELECT * FROM project_members WHERE member_id = $1 AND project_id = $2`;
  const {
    rows: [projectMember],
  } = await db.query(sql, [memberId, projectId]);

  return projectMember;
}

export async function updateLinkMemberToProject(
  project_membersId,
  projectId,
  memberId,
) {
  const sql = `UPDATE project_members SET member_id = $3 WHERE project_id = $2 AND project_membersId = $1 RETURNING *`;
  const {
    rows: [projectMember],
  } = await db.query(sql, [project_membersId, projectId, memberId]);

  return projectMember;
}

export async function getAllProjectsByOwnerId(ownerId) {
  const sql = `SELECT * FROM projects WHERE owner_id = $1`;
  const { rows: projects } = await db.query(sql, [ownerId]);
  return projects;
}

export async function getAllTasksByProjectId(projectId) {
  const sql = `SELECT tasks.* FROM tasks 
  JOIN project_tasks ON project_tasks.task_id = tasks.id
  WHERE project_tasks.project_id = $1`;
  const { rows: tasks } = await db.query(sql, [projectId]);

  return tasks;
}

export async function getAllMembersByProjectId(projectId) {
  const sql = `SELECT users.* FROM users
  JOIN project_members ON project_members.member_id = users.id
  WHERE project_members.project_id = $1`;

  const { rows: users } = await db.query(sql, [projectId]);

  return users;
}

export async function getOneProjectById(projectId) {
  const sql = `SELECT * FROM projects WHERE id = $1`;
  const {
    rows: [project],
  } = await db.query(sql, [projectId]);

  return project;
}

export async function getAllProjectByMemberId(memberId) {
  const sql = `SELECT projects.* FROM projects 
  JOIN project_members ON project_members.project_id = projects.id 
  WHERE project_members.member_id = $1`;

  const { rows: projects } = await db.query(sql, [memberId]);

  return projects;
}

export async function getAllProjectTasksByMemberIdAndProjectId(
  memberId,
  projectId,
) {
  const sql = `SELECT tasks.* FROM tasks
  JOIN project_tasks ON project_tasks.task_id = tasks.id
  JOIN project_members ON project_members.project_id = project_tasks.project_id
  WHERE project_members.member_id = $1 AND project_members.project_id = $2 AND tasks.assignee_id = $1`;
  const { rows: tasks } = await db.query(sql, [memberId, projectId]);

  return tasks;
}

// deleteProject

//deleteTask

//updateProject

//updateMember
