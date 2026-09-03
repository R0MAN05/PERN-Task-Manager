import prisma from "../utils/prisma.js";

export const createProject = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.userId;

  const project = await prisma.project.create({
    data: {
      name,
      description,
      userId
    }
  });

  res.status(201).json({
    message: "Project created successfully",
    project,
  });
};

export const getProjects = async (req, res) => {

  const userId = req.user.userId;
  const projects = await prisma.project.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    message: "Projects found successfully",
    projects,
  });
};

export const getProject = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.userId;

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

  res.status(200).json({
    message: "Project found successfully",
    project,
  });
};

export const updateProject = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.userId;

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

  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: req.body,
  });

  res.status(200).json({
    message: "Project updated successfully",
    project: updatedProject,
  });
};

export const deleteProject = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.userId;

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

  const deletedProject = await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  res.status(200).json({
    message: "Project deleted successfully",
    project: deletedProject,
  });
};