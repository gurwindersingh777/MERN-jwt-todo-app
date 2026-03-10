import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/statusCode.js";
import { z } from "zod";
import ApiError from "../utils/ApiError.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`PATH : ${req.path}`, err);

  if (err instanceof z.ZodError) {

    const errors = err.issues.map((err) => ({
      path: err.path.join("."),
      message: err.message
    }))

    return res.status(BAD_REQUEST).json({
      success: false,
      errors
    })
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
  }

  return res.status(INTERNAL_SERVER_ERROR).json({
    status: false,
    message: "Internal Server Error"
  })
}
