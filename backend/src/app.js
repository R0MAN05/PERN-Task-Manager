import express from "express";

import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js"

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      message: "Invalid JSON",
    });
  }

  next(error);
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);

app.use(errorHandler);

export default app;