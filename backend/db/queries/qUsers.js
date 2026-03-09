import db from "../client.js";
import bcrypt from "bcrypt";

export async function createUser(username, password) {
  const sql = `
        INSERT INTO users 
        (username, password) 
        VALUES ($1, $2) 
        RETURNING *
    `;
  const hashedPassword = await bcrypt.hash(password, 14);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

export async function getUserByUsernameAndPassword(username, password) {
  const sql = `
  SELECT * FROM users WHERE username = $1 AND is_deleted = false`;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function checkIsUsername(username) {
  const sql = `SELECT * FROM users WHERE username = $1`;

  const {
    rows: [user],
  } = await db.query(sql, [username]);
  if (!user) return false;
  return true;
}

export async function getUserById(id) {
  const sql = `
  SELECT *
  FROM users
  WHERE id = $1 AND is_deleted = false
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}

// export async function deleteUser(id) {
//   const sql = `UPDATE users SET is_deleted = true WHERE id = $1 RETURNING * `;

//   const {
//     rows: [user],
//   } = await db.query(sql, [id]);
//   return user;
// }

export async function getAllUsers() {
  const sql = `SELECT * FROM users WHERE is_deleted = false`;
  const { rows: users } = await db.query(sql);
  return users;
}

export async function softDeleteUser(id) {
  await db.query("BEGIN");

  // 1. Soft delete the user
  const {
    rows: [user],
  } = await db.query(
    `UPDATE users SET is_deleted = true WHERE id = $1 RETURNING *`,
    [id],
  );

  // 2. Remove them from project memberships
  await db.query(`DELETE FROM project_members WHERE member_id = $1`, [id]);

  // 3. Unassign them from project tasks
  await db.query(`UPDATE tasks SET assignee_id = NULL WHERE assignee_id = $1`, [
    id,
  ]);

  await db.query("COMMIT");
  return user;
}
