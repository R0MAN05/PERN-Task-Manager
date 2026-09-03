import prisma from "../utils/prisma.js";

export const createTask = async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.user.userId;

  // Make sure the project belongs to the logged-in user
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
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
  const userId = req.user.userId;

  // Verify project ownership first
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

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
  const userId = req.user.userId;

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        userId,
      },
    },
  });

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.status(200).json({
    message: "Task found successfully",
    task,
  });
};

export const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.userId;

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        userId,
      },
    },
  });

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
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
  const userId = req.user.userId;

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        userId,
      },
    },
  });

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

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
