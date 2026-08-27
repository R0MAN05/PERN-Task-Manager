import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

import { validate } from "../middleware/validate.js";
import { createProjectSchema, updateProjectSchema } from "../validations/project.validation.js";
import { validateId } from "../middleware/validateId.js";
import { asyncHandler } from "../middleware/asyncHandler.js";


const router = express.Router();

router.post("/", validate(createProjectSchema), asyncHandler(createProject));
router.get("/", asyncHandler(getProjects));
router.get("/:id", validateId("id", "project"), asyncHandler(getProject));
router.patch("/:id", validateId("id", "project"), validate(updateProjectSchema), asyncHandler(updateProject));
router.delete("/:id", validateId("id", "project"), asyncHandler(deleteProject));

export default router;
