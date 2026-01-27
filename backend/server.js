import app from "#app";
import db from "#db/client";

const PORT = process.env.PORT ?? 3001;

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening very carefully on port ${PORT}...`);
});
