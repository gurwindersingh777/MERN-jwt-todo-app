import { Router } from "express";
import { registerHandler } from "../controllers/auth.controllers.js";

const authRouter = Router()

authRouter.post("/register", registerHandler)

export default authRouter