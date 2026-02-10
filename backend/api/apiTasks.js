import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
// import { createToken } from "#utils/jwt";
import {
  createTask,
  getAllTasksByUserId,
  updateTask,
  getTaskByTaskId,
} from "../db/queries/qTasks.js";
import requireUser from "#middleware/requireUser";

router.use(requireUser);

router.param("id", async (req, res, next, id) => {
  const task = await getTaskByTaskId(id);
  if (!task) res.status(404).json({ error: "Task not found" });
  if (task.owner_id !== req.user.id)
    res
      .status(403)
      .json({ error: "You do not have permission to access this task" });

  console.log("type of date", typeof task.due_date, ": ", task.due_date);
  req.task = task;
  next();
});

router.post("/", requireBody(["name"]), async (req, res) => {
  const userId = req.user.id;
  const { name, description, due_date } = req.body;
  const task = await createTask(
    name,
    description ?? null,
    due_date ?? null,
    userId,
    assigneeId ?? null,
  );
  console.log("updated task", task);
  res.status(201).json(task);
});

router.get("/", async (req, res) => {
  const userId = req.user.id;
  const alltasks = await getAllTasksByUserId(userId);
  res.json(alltasks);
});

router.put("/:id", requireBody(["name"]), async (req, res) => {
  const { name, description, due_date } = req.body;
  const userId = req.user.id;
  const taskId = req.params.id;
  const updatedTask = await updateTask(
    name,
    description ?? null,
    due_date ?? null,
    userId,
    assigneeId ?? null,
  );
  res.json(updatedTask);
});

router.get("/:id", async (req, res) => {
  const task = req.task;
  res.json(task);
});
