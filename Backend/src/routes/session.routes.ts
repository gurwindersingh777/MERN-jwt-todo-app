import { Router } from "express";
import { deleteSessionsHandler, getSessionsHandler } from "../controllers/session.controller.js";

const sessionRouter = Router()

sessionRouter.get("/", getSessionsHandler)
sessionRouter.delete("/:id", deleteSessionsHandler)

export default sessionRouter