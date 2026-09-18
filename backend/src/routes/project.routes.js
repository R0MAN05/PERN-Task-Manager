import express from "express";

import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

import { addProjectMember, getProjectMembers, removeProjectMember } from "../controllers/projectMember.controller.js";

import { validate } from "../middleware/validate.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validations/project.validation.js";

import { validateId } from "../middleware/validateId.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { addProjectMemberSchema } from "../validations/projectMember.validation.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validate(createProjectSchema), asyncHandler(createProject));

router.get("/", asyncHandler(getProjects));

router.get("/:id", validateId("id", "project"), asyncHandler(getProject));

router.patch(
  "/:id",
  validateId("id", "project"),
  validate(updateProjectSchema),
  asyncHandler(updateProject),
);

router.delete("/:id", validateId("id", "project"), asyncHandler(deleteProject));

//ProjectMember related routes:

router.post(
  "/:projectId/members",
  validateId("projectId", "project"),
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(addProjectMemberSchema),
  asyncHandler(addProjectMember),
);

router.get(
  "/:projectId/members",
  validateId("projectId", "project"),
  authorize("SUPER_ADMIN", "ADMIN", "EMPLOYEE", "INTERN"),
  asyncHandler(getProjectMembers),
);

router.delete(
  "/:projectId/members/:userId",
  validateId("projectId", "project"),
  validateId("userId", "user"),
  authorize("SUPER_ADMIN", "ADMIN"),
  asyncHandler(removeProjectMember),
);

export default router;
