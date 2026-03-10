import { CookieOptions, Response } from "express"
import { NODE_ENV } from "../constants/env.js"
import { fifteenMinsFromNow, thirtyDaysFromNow } from "./date.js"


const cookieOptions: CookieOptions = {
  secure: NODE_ENV === "production",
  httpOnly: true,
  sameSite: "strict"
}

const getAccessTokenCookieOptions = (): CookieOptions => (
  { ...cookieOptions, expires: fifteenMinsFromNow() }
)

const getRefreshTokenCookieOptions = (): CookieOptions => (
  { ...cookieOptions, expires: thirtyDaysFromNow(), path: "/auth/refresh" }
)

type AuthCookieProps = {
  res: Response
  accessToken: string
  refreshToken: string
}

export function setAuthCookies({ res, accessToken, refreshToken }: AuthCookieProps) {
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions())
}