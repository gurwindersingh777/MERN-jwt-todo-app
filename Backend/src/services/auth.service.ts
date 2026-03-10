import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../constants/env.js"
import { CONFLICT } from "../constants/statusCode.js"
import { VerificationType } from "../constants/verificationType.js"
import { SessionModel } from "../models/session.model.js"
import { UserModel } from "../models/user.model.js"
import { VerificationCodeModel } from "../models/verficationCode.model.js"
import ApiError from "../utils/ApiError.js"
import { oneYearFromNow } from "../utils/date.js"
import jwt from 'jsonwebtoken'

type RegisterUserProps = {
  username: string
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

  const accessToken = jwt.sign(
    { userId: user._id, sessionId: session._id },
    JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  const createdUser = await UserModel.findById(user._id).select("-password")

  return { user: createdUser, accessToken, refreshToken }
}

export default registerUser