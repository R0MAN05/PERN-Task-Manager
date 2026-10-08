import prisma from "../utils/prisma.js";

export const requireProjectMember = async (req, res, next) => {
  const projectId = req.params.projectId;
  const userId = req.user.userId;

  const member = await prisma.projectMember.findUnique({
    where: {
      //used a compound key to get the member inside the project uisng the userId
      projectId_userId: {
        projectId,
        userId,
      },
    },
    include:{   //get the user's role.
      user:{
        select:{
          role: true,
        }
      }
    }
  });

  if (!member) {
    return res.status(403).json({
      message:
        "Only project members are allowed to perform this operation.",
    });
  }

  req.member = {
    userId: member.userId,
    role: member.user.role,
  }
  
  next();
};
