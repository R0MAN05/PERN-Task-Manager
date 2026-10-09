import prisma from "../utils/prisma.js";

export const createTask = async (req, res) => {
  const projectId = req.params.projectId;

  if (req.member.role === "INTERN") {
    return res.status(403).json({
      message: "Interns are not allowed to create tasks",
    });
  }

  const task = await prisma.task.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      status: req.body.status,
      projectId,
    },
  });

  res.status(201).json({
    message: "Task created successfully",
    task,
  });
};

export const getProjectTasks = async (req, res) => {
  const projectId = req.params.projectId;

  const tasks = await prisma.task.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    message: "Tasks found successfully",
    tasks,
  });
};

export const getTask = async (req, res) => {
  const taskId = req.params.id;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  res.status(200).json({
    message: "Task found successfully",
    task,
  });
};

export const updateTask = async (req, res) => {
  const taskId = req.params.id;

  if (req.member.role === "INTERN") {
    const allowedStatuses = ["IN_PROGRESS", "COMPLETED"];

    const hasUnauthorizedField = Object.keys(req.body).some(
      // Get the fields sent in req.body and check if any field is not "status"
      (field) => field !== "status",
    );

    if (hasUnauthorizedField) {
      return res.status(403).json({
        message: "Interns can only update task status",
      });
    }

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(403).json({
        message: "Interns can only set status to IN_PROGRESS or COMPLETED",
      });
    }
  }
  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: req.body,
  });

  res.status(200).json({
    message: "Task updated successfully",
    task: updatedTask,
  });
};

export const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  if (req.member.role === "INTERN")
    return res.status(403).json({
      message: "Interns are not allowed to delete tasks",
    });

  const deletedTask = await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  res.status(200).json({
    message: "Task deleted successfully",
    task: deletedTask,
  });
};
