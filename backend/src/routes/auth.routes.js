import express from "express";

import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation.js";

import {
  register,
  login,
  getMe
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get(
  "/me",
  authenticate,
  asyncHandler(getMe)
);

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(register)
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(login)
);

export default router;