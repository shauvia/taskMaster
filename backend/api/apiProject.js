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
  getOneProjectById,
  createProjectTask,
  updateProjectTask,
  getProjectMemberByMemberAndProjectId,
  updateLinkMemberToProject,
} from "../db/queries/qProjects.js";
// import { createTask } from "../db/queries/qTasks.js";

//updateProjectTask(
//   name,
//   description,
//   due_date,
//   userId,
//   assigneeId,
//   taskId,
// )

router.use(requireUser);

router.post("/", requireBody(["name"]), async (req, res) => {
  const { name, description } = req.body;
  const ownerId = req.user.id;
  const project = await createProject(name, description ?? null, ownerId);
  res.status(201).json(project);
});

router.post("/:id/tasks", requireBody(["name"]), async (req, res) => {
  try {
    let linkedMember;
    const userId = req.user.id;
    const projectId = req.params.id;
    const { name, description, due_date, assignee_id, role } = req.body;
    console.log("backend, apiProject Creating task with data:", {
      name,
      description,
      due_date,
      assignee_id,
      role,
    });
    const task = await createProjectTask(
      name,
      description ?? null,
      due_date ?? null,
      userId,
      assignee_id ?? null,
    );
    const linkedTask = await linkTaskToProject(projectId, task.id);
    if (task.assignee_id) {
      linkedMember = await linkMemberToProject(
        projectId,
        task.assignee_id,
        role ?? "member",
      );
    }
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating project task:", error);
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id/tasks/:taskId", async (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const taskId = req.params.taskId;
  const { name, description, due_date, assignee_id } = req.body;
  const task = await updateProjectTask(
    name,
    description ?? null,
    due_date ?? null,
    userId,
    assignee_id ?? null,
    taskId,
  );

  res.json(task);
});

router.get("/", async (req, res) => {
  const userId = req.user.id;
  const allProjects = await getAllProjectsByOwnerId(userId);
  res.json(allProjects);
});

router.get("/:id/tasks", async (req, res) => {
  const projectId = req.params.id;
  const tasks = await getAllTasksByProjectId(projectId);
  res.json(tasks);
});

router.get("/:id/members", async (req, res) => {
  const projectId = req.params.id;
  const members = await getAllMembersByProjectId(projectId);
  res.json(members);
});

router.get("/:id", async (req, res) => {
  const projectId = req.params.id;
  const project = await getOneProjectById(projectId);
  res.json(project);
});
