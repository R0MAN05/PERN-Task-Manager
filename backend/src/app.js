import express from "express";

import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);

app.use(errorHandler);

export default app;