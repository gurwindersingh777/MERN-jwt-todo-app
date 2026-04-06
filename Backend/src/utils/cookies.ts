import { CookieOptions, Response } from "express"
import { NODE_ENV } from "../constants/env.js"
import { fifteenMinsFromNow, thirtyDaysFromNow } from "./date.js"
import { REFRESH_PATH } from "../constants/refreshPath.js"


const cookieOptions: CookieOptions = {
  secure: NODE_ENV === "production",
  httpOnly: true,
  sameSite: NODE_ENV === "production" ? "none" : "lax",
}

export const getAccessTokenCookieOptions = (): CookieOptions => (
  { ...cookieOptions, expires: fifteenMinsFromNow() }
)

export const getRefreshTokenCookieOptions = (): CookieOptions => (
  { ...cookieOptions, expires: thirtyDaysFromNow(), path: REFRESH_PATH }
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

export function clearAuthCookies(res: Response) {
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken", { path: REFRESH_PATH })
}