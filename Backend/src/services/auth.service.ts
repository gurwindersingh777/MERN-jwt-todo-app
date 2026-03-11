import { CONFLICT, UNAUTHORIZED } from "../constants/statusCode.js"
import { VerificationType } from "../constants/verificationType.js"
import { SessionModel } from "../models/session.model.js"
import { UserModel } from "../models/user.model.js"
import { VerificationCodeModel } from "../models/verficationCode.model.js"
import ApiError from "../utils/ApiError.js"
import { ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/date.js"
import { generateTokens, verifyToken } from "../utils/jwt.js"

type RegisterUserProps = {
  username: string
  email: string
  password: string
  userAgent?: string
}

type LoginUserProps = {
  email: string
  password: string
  userAgent?: string
}

async function registerUser(data: RegisterUserProps) {

  const existingUser = await UserModel.exists({ email: data.email })

  if (existingUser) {
    throw new ApiError(CONFLICT, "User already exists")
  }

  const usernameExists = await UserModel.exists({ username: data.username })

  if (usernameExists) {
    throw new ApiError(CONFLICT, "Username is already taken")
  }

  const user = await UserModel.create({
    username: data.username,
    email: data.email,
    password: data.password
  })

  await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationType.EmailVerification,
    expiresAt: oneYearFromNow()
  })

  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent
  })

  const { accessToken, refreshToken } = generateTokens(user._id.toString(), session._id.toString())

  const createdUser = await UserModel.findById(user._id).select("-password")

  return { user: createdUser, accessToken, refreshToken }
}

async function loginUser(data: LoginUserProps) {

  const user = await UserModel.findOne({ email: data.email }).select("+password")

  if (!user) {
    throw new ApiError(UNAUTHORIZED, "Invalid email or password")
  }

  const isPasswordValid = await user.comparePassword(data.password)

  if (!isPasswordValid) {
    throw new ApiError(UNAUTHORIZED, "Invalid email or password")
  }

  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent
  })

  const { accessToken, refreshToken } = generateTokens(user._id.toString(), session._id.toString())

  const loggedInUser = await UserModel.findById(user._id)

  return { user: loggedInUser, accessToken, refreshToken }
}

async function refreshAccessToken(token: string) {

  const payload = verifyToken(token)

  if (!payload) {
    throw new ApiError(UNAUTHORIZED, "Invalid refresh token")
  }

  const session = await SessionModel.findById(payload.sessionId)


  if (!session) {
    throw new ApiError(UNAUTHORIZED, "Session not found")
  }

  if (session.expiresAt.getTime() < Date.now()) {
    throw new ApiError(UNAUTHORIZED, "Session expired")
  }

  if (session.expiresAt.getTime() - Date.now() <= ONE_DAY_MS) {
    session.expiresAt = thirtyDaysFromNow()
    await session.save()
  }

  const { accessToken, refreshToken } = generateTokens(session.userId.toString(), session._id.toString())

  return { accessToken, newRefreshToken: refreshToken }
}


export { registerUser, loginUser, refreshAccessToken }