import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import {
  createProject,
  linkTaskToProject,
  linkMemberToProject,
  getAllProjectsByOwnerId,
  getAllTasksByProjectId,
  getAllMembersByProjectId,
} from "../db/queries/qProjects.js";
import { createTask } from "../db/queries/qTasks.js";

router.use(requireUser);

router.post("/", requireBody(["name"]), async (req, res) => {
  const { name, description } = req.body;
  const ownerId = req.user.id;
  const project = await createProject(name, description ?? null, ownerId);
  res.status(201).json(project);
});

router.post("/:id/tasks", requireBody(["name"]), async (req, res) => {
  let linkedMember;
  const userId = req.user.id;
  const projectId = req.params.id;
  const { name, description, due_date, assigneeId, role } = req.body;
  const task = await createTask(
    name,
    description ?? null,
    due_date ?? null,
    userId,
    assigneeId ?? null,
  );
  //   if (!task) return res.status(404).json({ error: "Task not found" });
  //   if (task.owner_id !== req.user.id)
  //     return res
  //       .status(403)
  //       .json({ error: "You do not have permission to access this task" });
  const linkedTask = await linkTaskToProject(projectId, task.id);
  if (task.assignee_id) {
    linkedMember = await linkMemberToProject(
      projectId,
      task.assignee_id,
      role ?? "member",
    );
  }
  res.status(201).json({ task, linkedTask, linkedMember }); //should it be returning all?
});

router.get("/", async (req, res) => {
  const userId = req.user.id;
  const allProjects = await getAllProjectsByOwnerId(userId);
  res.json({ allProjects });
});

router.get("/:id/tasks", async (req, res) => {
  const projectId = req.params.id;
  const tasks = await getAllTasksByProjectId(projectId);
  res.json({ tasks });
});

router.get("/:id/members", async (req, res) => {
  const projectId = req.params.id;
  const members = await getAllMembersByProjectId(projectId);
  res.json({ members });
});
