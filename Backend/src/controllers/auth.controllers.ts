import { CREATED, OK, UNAUTHORIZED } from "../constants/statusCode.js"
import { SessionModel } from "../models/session.model.js"
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema, verificationCodeSchema } from "../schema/auth.schema.js"
import { loginUser, refreshAccessToken, registerUser, resetPassword, sendPasswordResetEmail, verifyEmail } from "../services/auth.service.js"
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

const verifyEmailHandler = AsyncHandler(
  async (req, res) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code);

    const { user } = await verifyEmail(verificationCode)

    return res.status(OK).json(
      {
        user,
        message: "Email verified successfully"
      }
    )
  }
)

const forgetPasswordHandler = AsyncHandler(
  async (req, res) => {

    const email = emailSchema.parse(req.body.email)

    await sendPasswordResetEmail(email)

    return res.status(OK).json({
      message: "Password reset email sent"
    })
  }
)

const resetPassworHandler = AsyncHandler(
  async (req, res) => {
    const request = resetPasswordSchema.parse(req.body)

    await resetPassword(request)

    clearAuthCookies(res)

    return res.status(OK).json({
      message: "Password reset successfully"
    })
  }
)

export {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  verifyEmailHandler,
  forgetPasswordHandler,
  resetPassworHandler
}