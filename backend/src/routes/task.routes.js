import express from "express";
import { createTask, getProjectTasks, getTask, updateTask, deleteTask} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/projects/:projectId/tasks", createTask);
router.get("/projects/:projectId/tasks", getProjectTasks);

router.get("/tasks/:id", getTask);
router.patch("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;