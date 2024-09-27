import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createError(401, "Unauthorized. No token provided."));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(createError(401, "Unauthorized. No token provided."));
  }

  jwt.verify(token, process.env.JWT_KEY || "backend king", async (err, payload) => {
    if (err) {
      return next(createError(403, "Forbidden. Invalid token."));
    }
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
    next();
  });
};
