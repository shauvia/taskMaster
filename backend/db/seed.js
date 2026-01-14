import db from "#db/client";
import { createUser } from "./queries/qUsers.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser("user1", "dupa");
  const user2 = await createUser("user2", "dupa");

  console.log("Database has been successfully seeded");
}
