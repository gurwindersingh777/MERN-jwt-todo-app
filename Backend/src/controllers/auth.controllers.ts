import { CREATED, OK, UNAUTHORIZED } from "../constants/statusCode.js"
import { SessionModel } from "../models/session.model.js"
import { loginSchema, registerSchema } from "../schema/auth.schema.js"
import { loginUser, refreshAccessToken, registerUser } from "../services/auth.service.js"
import ApiError from "../utils/ApiError.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import { clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookies } from "../utils/cookies.js"
import { verifyToken } from "../utils/jwt.js"

const registerHandler = AsyncHandler(

  async (req, res) => {

    const request = registerSchema.parse({ ...req.body, userAgent: req.header("user-agent") })

    const { user, accessToken, refreshToken } = await registerUser(request)

    setAuthCookies({ res, accessToken, refreshToken })

    return res
      .status(CREATED)
      .json(user)
  }
)

const loginHandler = AsyncHandler(

  async (req, res) => {
    const request = loginSchema.parse({ ...req.body, userAgent: req.header("user-agent") })

    const { user, accessToken, refreshToken } = await loginUser(request);

    setAuthCookies({ res, accessToken, refreshToken })

    return res
      .status(OK)
      .json(user)
  }

)

const logoutHandler = AsyncHandler(

  async (req, res) => {
    const accessToken: string = req.cookies.accessToken as string
    const payload = verifyToken(accessToken);

    if (payload) {
      await SessionModel.findByIdAndDelete(payload.sessionId)
    }

    clearAuthCookies(res)

    return res
      .status(OK)
      .json({
        message: "Logout Successfully"
      })
  }
)

const refreshHandler = AsyncHandler(

  async (req, res) => {
    const refreshToken = req.cookies.refreshToken as string

    if (!refreshToken) {
      throw new ApiError(UNAUTHORIZED, "Refresh token missing")
    }

    const { accessToken, newRefreshToken } = await refreshAccessToken(refreshToken);

    if (newRefreshToken) {
      res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions())
    }
    return res
      .status(OK)
      .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
      .json({
        message: "Access token refreshed"
      })
  }
)

export {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshHandler
}