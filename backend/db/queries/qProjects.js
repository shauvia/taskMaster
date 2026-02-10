import db from "#db/client";

export async function createProject(name, description, ownerId) {
  const sql = `INSERT INTO project (name, description, owner_id) VALUES 
    ($1, $2, $3) RETURNING *`;

  const {
    rows: [project],
  } = await db.query(sql, [name, description, ownerId]);

  return project;
}

//createTask

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

// deleteProject

//deleteTask

//updateProject

//updateMember
