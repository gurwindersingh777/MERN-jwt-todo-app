import { Router } from "express";
import { loginHandler, logoutHandler, refreshHandler, registerHandler, forgetPasswordHandler, verifyEmailHandler, resetPassworHandler } from "../controllers/auth.controllers.js";

const authRouter = Router()

authRouter.post("/register", registerHandler)
authRouter.post("/login", loginHandler)
authRouter.post("/logout", logoutHandler)
authRouter.post("/refresh", refreshHandler)
authRouter.post("/email/verify/:code", verifyEmailHandler)
authRouter.post("/password/forgot", forgetPasswordHandler)
authRouter.post("/password/reset", resetPassworHandler)

export default authRouter