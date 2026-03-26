import { Router } from "express";
import { getUserHandler } from "../controllers/user.controllers.js";

const userRouter = Router()

userRouter.get("/", getUserHandler)

export default userRouter