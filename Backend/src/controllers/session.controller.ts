import z from "zod";
import { NOT_FOUND, OK } from "../constants/statusCode.js";
import { SessionModel } from "../models/session.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";

const getSessionsHandler = AsyncHandler(
  async function (req, res) {
    const sessions = await SessionModel.find(
      {
        userId: req.userId,
        expiresAt: { $gt: new Date() }
      },
      {
        _id: 1,
        userAgent: 1,
        createdAt: 1
      },
      {
        sort: { createdAt: -1 },
      }
    )

    return res
      .status(OK)
      .json(sessions.map((session) => ({
        ...session.toObject(),
        ...(session._id.equals(req.sessionId) && { isCurrent: true })
      })))
  }
)

const deleteSessionsHandler = AsyncHandler(
  async (req, res) => {
    const sessionId = z.string().parse(req.params.id)

    const deletedSession = await SessionModel.findOneAndDelete({
      _id: sessionId,
      userId: req.userId,
    })

    if (!deletedSession) {
      throw new ApiError(NOT_FOUND, "Session not found")
    }

    return res
      .status(OK)
      .json({
        message: "Session deleted"
      })
  }
)

export { getSessionsHandler, deleteSessionsHandler }