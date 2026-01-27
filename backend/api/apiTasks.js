import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
// import { createToken } from "#utils/jwt";
import { createTask, getAllTasksByUserId } from "../db/queries/qTasks.js";
import requireUser from "#middleware/requireUser";

router.use(requireUser); // does it take care of token and checks out if user is logged in?

router.post(
  "/",
  requireBody(["name", "description", "due_date"]),
  async (req, res) => {
    const userId = req.user.id;
    const { name, description, due_date } = req.body;
    const task = await createTask(name, description, due_date, userId);
    res.status(201).json(task);
  },
);

router.get("/", async (req, res) => {
  console.log("Sialala");
  const userId = req.user.id;
  console.log("Fetching tasks for user:", req.user.id);
  const alltasks = await getAllTasksByUserId(userId);
  console.log("Fetching tasks for user:", alltasks);
  res.json(alltasks);
});
