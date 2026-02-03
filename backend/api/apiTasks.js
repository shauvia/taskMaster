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

router.use(requireUser); // does it take care of token and checks out if user is logged in?

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

router.post(
  "/",
  requireBody(["name", "description", "due_date"]),
  async (req, res) => {
    const userId = req.user.id;
    const { name, description, due_date } = req.body;
    const task = await createTask(name, description, due_date, userId);
    console.log("updated task", task);
    res.status(201).json(task);
  },
);

router.get("/", async (req, res) => {
  console.log("Sialala");
  const userId = req.user.id;
  console.log("Fetching tasks for user:", req.user.id);
  const alltasks = await getAllTasksByUserId(userId);
  console.log("Fetching tasks for user:", alltasks);
  console.log("1st task:", typeof alltasks[0].due_date);
  res.json(alltasks);
});

router.put(
  "/:id",
  requireBody(["name", "description", "due_date"]),
  async (req, res) => {
    const { name, description, due_date } = req.body;
    const userId = req.user.id;
    const taskId = req.params.id;
    const updatedTask = await updateTask(
      name,
      description,
      due_date,
      taskId,
      userId,
    );
    res.json(updatedTask);
  },
);

router.get("/:id", async (req, res) => {
  const task = req.task;
  res.json(task);
});
