import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  console.log(req.headers.authorization)
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Authentication required" });

  const [scheme, token] = authHeader.split(" ");   
  

  if (scheme !== "Bearer" || !token)
    return res.status(401).json({ message: "Authentication required" }); //This prevents malformed authorization headers from getting through.

  try {
    //You might wonder:"Why are we using try/catch here when we removed try/catch from our controllers?"
    //  Because jwt.verify() throws synchronously when the token is invalid.  Your asyncHandler catches Promise rejections from async controllers. These are different situations.

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // constains something like {userId: 5, iat: 1756600000, exp: 1756603600} since we put const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET, {expiresIn: "1h",}); in the login controller as we created a token.

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    console.error("Token invalid/expired", error);
    res.status(401).json({ message: "Token invalid/expired" });
  }
};
