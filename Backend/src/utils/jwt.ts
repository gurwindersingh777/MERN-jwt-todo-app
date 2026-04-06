import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../constants/env.js'

export const generateTokens = (userId: string, sessionId: string) => {

  const accessToken = jwt.sign(
    { userId, sessionId },
    JWT_ACCESS_SECRET,
    { expiresIn: "15min" }
  )

  const refreshToken = jwt.sign(
    { sessionId },
    JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  )

  return { accessToken, refreshToken }
}

export const verifyToken = (token: string, secret: string): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload
  } catch (error) {
    throw new Error("Invalid or expired token")
  }
}