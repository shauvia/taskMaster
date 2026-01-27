import db from "#db/client";
import { createUser } from "./queries/qUsers.js";
import { createTask } from "./queries/qTasks.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser("user1", "dupa");
  const user2 = await createUser("user2", "dupa");

  for (let i = 0; i < 5; i++) {
    await createTask(`task ${i}`, `description ${i}`, "2024-12-31", 1);
  }

  console.log("Database has been successfully seeded");
}
