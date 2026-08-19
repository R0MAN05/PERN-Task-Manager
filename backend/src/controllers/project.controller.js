import prisma from "../utils/prisma.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
      },
    });
    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({
      message: "Projects found successfully",
      projects,
    });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProject = async (req, res) => {
  const projectId = Number(req.params.id);

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

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({
      message: "Projects found successfully",
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProject = async (req, res) => {
  const projectId = Number(req.params.id);
  const { name, description } = req.body;

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

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        name,
        description,
      },
    });

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteProject = async (req, res) => {
  const projectId = Number(req.params.id);

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

    const deletedProject = await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    res.status(200).json({
      message: "Project deleted successfully",
      project: deletedProject,
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
