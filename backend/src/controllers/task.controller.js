import prisma from "../utils/prisma.js";

export const createTask = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);
    const { title, description, priority, status } = req.body;

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status,
        projectId: projectId,
      },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Failed to create task", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getProjectTasks = async (req, res) => {
  const projectId = Number(req.params.projectId);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return res.status(400).json({
      message: "Invalid project ID",
    });
  }
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "Tasks found successfully",
      tasks,
    });
  } catch (error) {
    console.error("Failed to fetch the tasks", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getTask = async (req, res) => {
  const taskId = Number(req.params.id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
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
  } catch (error) {
    console.error("Failed to fetch the task", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateTask = async (req, res) => {
  const taskId = Number(req.params.id);
  const { title, description, priority, status } = req.body;

    if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
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
      data: {
        title,
        description,
        priority,
        status,
      },
    });

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task failed", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteTask = async (req, res) => {
  const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
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
  } catch (error) {
    console.error("Deletion of task failed", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
