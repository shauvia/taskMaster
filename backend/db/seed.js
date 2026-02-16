import db from "#db/client";
import { createUser } from "./queries/qUsers.js";
import { createTask } from "./queries/qTasks.js";
import {
  createProject,
  linkTaskToProject,
  linkMemberToProject,
} from "./queries/qProjects.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser("user1", "dupa");
  const user2 = await createUser("user2", "dupa");
  const user3 = await createUser("user3", "dupa");
  const user4 = await createUser("user4", "dupa");
  const user5 = await createUser("user5", "dupa");

  for (let i = 0; i < 5; i++) {
    await createTask(`task ${i}`, `description ${i}`, "2024-12-31", 1);
    await createTask(`tasku ${i}`, `description ${i}`, "2024-12-31", 2);
    await createTask(`taski ${i}`, `description ${i}`, "2024-12-31", 3);
    await createTask(`taske ${i}`, `description ${i}`, "2024-12-31", 4);
    await createTask(`taska ${i}`, `description ${i}`, "2024-12-31", 5);
  }
  // for (let i = 0; i < 3; i++) {
  //   await createProject(
  //     `chruper project ${i}`,
  //     `super description ${i}`,
  //     i + 1,
  //   );

  //   await createTask(`tasky ${i}`, `description ${i}`, "2024-12-31", i + 1, 2);
  //   await createTask(`taskl ${i}`, `description ${i}`, "2024-12-31", i + 1, 3);
  //   await createTask(`taskm ${i}`, `description ${i}`, "2024-12-31", i + 1, 4);
  //   await linkMemberToProject(i + 1, 1);
  //   await linkMemberToProject(i + 1, 5);
  //   await linkMemberToProject(i + 1, 4);
  // }
  // for (let i = 0; i < 3; i++) {
  //   await linkTaskToProject(i + 1, 26 + i);
  //   await linkTaskToProject(i + 1, 29 + i);
  //   await linkTaskToProject(i + 1, 32 + i);
  // }

  // await createTask(name, description, due_date, userId, assigneeId);
  // await linkTaskToProject(projectId, taskId);
  // await linkMemberToProject(projectId, memberId);
  console.log("Database has been successfully seeded");
}
