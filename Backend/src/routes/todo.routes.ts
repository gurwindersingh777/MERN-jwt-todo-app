import { Router } from "express";
import { addTodoHandler, deleteTodoHandler, getTodoHandler, updateTodoHandler } from "../controllers/todo.controllers.js";

const todoRouter = Router()

todoRouter.get("/", getTodoHandler)
todoRouter.post("/", addTodoHandler)
todoRouter.patch("/:id", updateTodoHandler)
todoRouter.delete("/:id", deleteTodoHandler)

export default todoRouter