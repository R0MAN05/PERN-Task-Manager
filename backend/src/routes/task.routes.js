import express from "express";
import {
  createTask,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

import { validate } from "../middleware/validate.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validations/task.validation.js";
import { validateId } from "../middleware/validateId.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/projects/:projectId/tasks",
  validateId("projectId", "project"),
  validate(createTaskSchema),
  asyncHandler(createTask),
);
router.get(
  "/projects/:projectId/tasks",
  validateId("projectId", "project"),
  asyncHandler(getProjectTasks),
);

router.get("/tasks/:id", validateId("id", "task"), asyncHandler(getTask));
router.patch(
  "/tasks/:id",
  validateId("id", "task"),
  validate(updateTaskSchema),
  asyncHandler(updateTask),
);
router.delete("/tasks/:id", validateId("id", "task"), asyncHandler(deleteTask));

export default router;
