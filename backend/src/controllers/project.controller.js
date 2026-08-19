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
    const project = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: Number(id), //converting the string id to number since the db project model expects integer.
      },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;

  const { name, description } = req.body;

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: Number(id),
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
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const deletedProject = await prisma.project.delete({
      where: {
        id: Number(id),
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