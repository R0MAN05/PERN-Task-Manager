import prisma from "../utils/prisma.js";

export const createTask = async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.user.userId;

  // Make sure the member belongs to the project
  const member = await prisma.projectMember.findUnique({
    where: {
      //used a compound key to get the member inside the project uisng the userId
      projectId_userId: {
        projectId,
        userId,
      },
    },
    include: {
      user: {
        select: {
          role: true,
        },
      },
    },
  });

  if (!member) {
    return res.status(404).json({
      message: "User is not a member of this project",
    });
  }

  if (member.user.role === "INTERN") {
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
  const userId = req.user.userId;

  // Verify the user is the member of the project
  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (!member) {
    return res.status(404).json({
      message: "User is not a member of this project",
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
    },
  });

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }
  // Verify the user is the member of the project
  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: task.projectId,
        userId,
      },
    },
  });

  if (!member) {
    return res.status(404).json({
      message: "User is not a member of this project",
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
    },
  });

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: task.projectId,
        userId,
      },
    },
    include: {
      user: {
        select: {
          role: true,
        },
      },
    },
  });

  if (!member) {
    return res.status(404).json({
      message: "User is not a member of this project",
    });
  }

  if (member.user.role === "INTERN") {
    const hasUnauthorizedField = Object.keys(req.body).some(
      // Get the fields sent in req.body and check if any field is not "status"
      (field) => field !== "status",
    );

    if (hasUnauthorizedField) {
      return res.status(403).json({
        message: "Interns are not allowed to update the tasks",
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
  const userId = req.user.userId;

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: task.projectId,
        userId,
      },
    },
    include: {
      user: {
        select: {
          role: true,
        },
      },
    },
  });

  if (!member)
    return res.status(404).json({
      message: "User is not a member of this project",
    });

  if (member.user.role === "INTERN")
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
