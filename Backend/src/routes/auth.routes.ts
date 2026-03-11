import { Router } from "express";
import { loginHandler, logoutHandler, refreshHandler, registerHandler } from "../controllers/auth.controllers.js";

const authRouter = Router()

authRouter.post("/register", registerHandler)
authRouter.post("/login", loginHandler)
authRouter.post("/logout", logoutHandler)
authRouter.post("/refresh", refreshHandler)

export default authRouter