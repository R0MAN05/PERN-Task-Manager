import prisma from "../utils/prisma.js";

export const addProjectMember = async (req, res) => {
  const projectId = req.params.projectId;
  const { userId } = req.body;

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

  const user = await prisma.user.findUnique({
    // User to add to the project
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const requester = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });

  // EMPLOYEE and INTERN cannot add members
  // if (requester.role === "EMPLOYEE" || requester.role === "INTERN") {      // commented because the route already dont allow the employee and interns.
  //   return res.status(403).json({
  //     message: "You are not allowed to add project members",
  //   });
  // }

  // ADMIN can only add EMPLOYEE or INTERN
  if (
    requester.role === "ADMIN" &&
    user.role !== "EMPLOYEE" &&
    user.role !== "INTERN"
  ) {
    return res.status(403).json({
      message: "Admins can only assign employees or interns",
    });
  }

  // Check if the user is already a member
  const existingMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (existingMember) {
    return res.status(409).json({
      message: "User is already a member of this project",
    });
  }

  // Add user to project
  const member = await prisma.projectMember.create({
    data: {
      projectId,
      userId,
    },
  });

  return res.status(201).json({
    message: "Project member added successfully",
    member,
  });
};

export const getProjectMembers = async (req, res) => {
  const projectId = req.params.projectId;

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

  // Check if the user is already a member
  const existingMembers = await prisma.projectMember.findMany({
    where: {
      projectId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (existingMembers.length === 0)
    return res.status(404).json({ message: "No project members found" });

  res.status(200).json({
    message: "Project members found successfully",
    existingMembers,
  });
};

export const removeProjectMember = async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.params.userId;

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

  const user = await prisma.user.findUnique({
    // User to add to the project
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const existingMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (!existingMember) {
    return res.status(404).json({
      message: "User is not a member of this project",
    });
  }

  const deletedProjectMember = await prisma.projectMember.delete({
    where: {
      id: existingMember.id,
    },
  });

  return res.status(200).json({
    message: "Project member removed successfully",
    deletedProjectMember,
  });
};
