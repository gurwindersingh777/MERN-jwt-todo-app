import { ErrorRequestHandler } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/status.js";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`PATH : ${req.path}`, err);
  return res
    .status(INTERNAL_SERVER_ERROR)
    .json({
      status: false,
      message: "Internal Server Error"
    })
}

export default errorHandler