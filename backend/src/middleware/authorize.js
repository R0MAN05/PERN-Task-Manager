import prisma from "../utils/prisma.js";

export const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    // 1. Get user ID from req.user
    const userId = req.user.userId;

    // 2. Find the user in database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // 3. If user doesn't exist → 401
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // 4. Check whether user's role is in allowedRoles
    if (!allowedRoles.includes(user.role)) { 
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    next();
  };
};
