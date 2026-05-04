import app from "#app";
import db from "#db/client";
import { runTaskReminders } from "#utils/taskReminder";

const PORT = process.env.PORT ?? 3001;

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening very carefully on port ${PORT}...`);
});

runTaskReminders().catch(console.error);
setInterval(
  () => {
    runTaskReminders().catch(console.error);
  },
  60 * 60 * 1000,
);
