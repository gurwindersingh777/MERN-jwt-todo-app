import { NOT_FOUND, OK } from "../constants/statusCode.js";
import { UserModel } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";


const getUserHandler = AsyncHandler(
  async (req, res) => {
    const user = await UserModel.findById(req.userId).select("-password")
    if (!user) {
      throw new ApiError(NOT_FOUND, "User not found")
    }
    return res
      .status(OK)
      .json(user)
  }
)

export { getUserHandler }