import express from "express";
const app = express();
export default app;

import cors from "cors";

import usersRouter from "#api/apiUsers";
import tasksRouter from "./api/apiTasks.js";
import projectRouter from "./api/apiProject.js";
import getUserFromToken from "#middleware/getUserFromToken";
import morgan from "morgan";
import cookieParser from "cookie-parser";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
// when frontend
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", //Switching from a hard‑coded value to a dynamic environment‑based value.
    credentials: true, // Required to receive cookies from the frontend
  }),
);

app.get("/", (req, res) => {
  res.status(200).send("API running");
});

app.use(getUserFromToken);
app.use("/api/users", usersRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/projects", projectRouter);
app.use((err, req, res, next) => {
  // A switch statement can be used instead of if statements
  // when multiple cases are handled the same way.
  switch (err.code) {
    // Invalid type
    case "22P02":
      return res.status(400).send(err.message);
    // Unique constraint violation
    case "23505":
    // Foreign key violation
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
