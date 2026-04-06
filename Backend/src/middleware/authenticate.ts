import { RequestHandler } from "express";
import ApiError from "../utils/ApiError.js";
import { UNAUTHORIZED } from "../constants/statusCode.js";
import { verifyToken } from "../utils/jwt.js";
import { JWT_ACCESS_SECRET } from "../constants/env.js";


const authenticate: RequestHandler = (req, res, next) => {

  const accessToken = req.cookies.accessToken as string;

  if (!accessToken) {
    throw new ApiError(UNAUTHORIZED, "Not authorized")
  }

  try {
    const payload = verifyToken(accessToken,JWT_ACCESS_SECRET);
    req.userId = payload.userId
    req.sessionId = payload.sessionId
    next()
  } catch (error: any) {
    throw new ApiError(UNAUTHORIZED, error.message === "jwt expired" ? "Token expired" : "Invalid token")
  }
}

export default authenticate
