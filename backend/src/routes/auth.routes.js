import express from "express";

import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

import {
  register,
  login,
  getMe,  
  adminTest,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authenticate.js"; //to check if the user is registered or not.
import { authorize } from "../middleware/authorize.js"; // to authorize the user on the basis of their roles.

const router = express.Router();

router.get("/me", authenticate, asyncHandler(getMe));

router.post("/register", validate(registerSchema), asyncHandler(register));

router.post("/login", validate(loginSchema), asyncHandler(login));

router.get(
  "/admin-test",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  asyncHandler(adminTest)
);

export default router;
