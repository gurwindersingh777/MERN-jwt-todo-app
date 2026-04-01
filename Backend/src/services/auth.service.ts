import { CORS_ORIGIN } from "../constants/env.js"
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUEST, UNAUTHORIZED } from "../constants/statusCode.js"
import { VerificationType } from "../constants/verificationType.js"
import { SessionModel } from "../models/session.model.js"
import { UserModel } from "../models/user.model.js"
import { VerificationCodeModel } from "../models/verficationCode.model.js"
import ApiError from "../utils/ApiError.js"
import { fiveMinsAgo, ONE_DAY_MS, oneHourFromNow, oneYearFromNow, thirtyDaysFromNow } from "../utils/date.js"
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emailTemplate.js"
import { generateTokens, verifyToken } from "../utils/jwt.js"
import { sendMail } from "../utils/sendMail.js"
import bcrypt from 'bcrypt'

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

type ResetPasswordProps = {
  password: string
  verificationCode: string
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

  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationType.EmailVerification,
    expiresAt: oneYearFromNow()
  })

  const url = `${CORS_ORIGIN}/email/verify/${verificationCode._id}`
  const { error } = await sendMail({ to: user.email, ...getVerifyEmailTemplate(url) })

  if (error) {
    console.log(`${error.name} - ${error.message}`);
  }

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

async function verifyEmail(code: string) {

  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationType.EmailVerification,
    expiresAt: { $gt: Date.now() }
  })

  if (!validCode) {
    throw new ApiError(NOT_FOUND, "Invalid or expired verfication code")
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    { verified: true },
    { new: true }
  ).select("-password")

  if (!updatedUser) {
    throw new ApiError(INTERNAL_SERVER_ERROR, "Failed to verify email")
  }

  await validCode.deleteOne()

  return { user: updatedUser }

}

async function sendPasswordResetEmail(email: string) {

  const user = await UserModel.findOne({ email })

  if (!user) {
    throw new ApiError(UNAUTHORIZED, "Invalid email")
  }

  const count = await VerificationCodeModel.countDocuments({
    userId: user._id,
    type: VerificationType.PasswordReset,
    createdAt: { $gt: fiveMinsAgo() }
  })

  if (count > 1) {
    throw new ApiError(TOO_MANY_REQUEST, "Too many request, please try again later")
  }

  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationType.PasswordReset,
    expiresAt: oneHourFromNow()
  })

  const url = `${CORS_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${verificationCode.expiresAt.getTime()}`

  const { data, error } = await sendMail({ to: user.email, ...getPasswordResetTemplate(url) })

  if (!data?.id) {
    throw new ApiError(INTERNAL_SERVER_ERROR, `${error?.name} - ${error?.message}`)
  }

  return {
    url,
    emailId: data.id
  }
}

async function resetPassword({ password, verificationCode }: ResetPasswordProps) {
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: VerificationType.PasswordReset,
    expiresAt: { $gt: new Date() }
  })

  if (!validCode) {
    throw new ApiError(NOT_FOUND, "Invalid or expired verification code")
  }

  const hassedPassword = await bcrypt.hash(password, 10)

  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    {
      password: hassedPassword
    }).select("-password")

  await validCode.deleteOne()

  await SessionModel.deleteMany({ userId: updatedUser?._id })

  return { user: updatedUser }
}


export {
  registerUser,
  loginUser,
  refreshAccessToken,
  verifyEmail,
  sendPasswordResetEmail,
  resetPassword
}