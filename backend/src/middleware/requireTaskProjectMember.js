import prisma from "../utils/prisma.js";

export const requireTaskProjectMember = async (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.user.userId;

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    return res.status(404).json({
      message: "Task not found.",
    });
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      //used a compound key to get the member inside the project uisng the userId
      projectId_userId: {
        projectId: task.projectId,
        userId,
      },
    },
    include: {
      //get the user's role.
      user: {
        select: {
          role: true,
        },
      },
    },
  });

  if (!member) {
    return res.status(404).json({
      message: "Project member not found",
    });
  }

  req.member = {
    userId: member.userId,
    role: member.user.role,
  };

  next();
};
