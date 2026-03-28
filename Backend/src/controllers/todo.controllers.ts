import z from "zod";
import { NOT_FOUND, OK } from "../constants/statusCode.js";
import { TodoModel } from "../models/todo.model.js";
import { todoSchema, updateTodoSchema } from "../schema/todo.schema.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";

const addTodoHandler = AsyncHandler(
  async (req, res) => {
    const data = todoSchema.parse(req.body);

    const addedTodo = await TodoModel.create({
      title: data.title,
      description: data.description,
      userId: req.userId
    })

    return res
      .status(OK)
      .json(addedTodo)
  }
)
const updateTodoHandler = AsyncHandler(
  async (req, res) => {
    const todoId = z.string().parse(req.params.id)
    const data = updateTodoSchema.parse(req.body)

    const updatedTodo = await TodoModel.findOneAndUpdate(
      {
        _id: todoId,
        userId: req.userId
      },
      { $set: data },
      { returnDocument: "after" }
    )

    if (!updatedTodo) {
      throw new ApiError(NOT_FOUND, "Todo not found")
    }

    return res
      .status(OK)
      .json(updatedTodo)
  }
)

const deleteTodoHandler = AsyncHandler(
  async (req, res) => {
    const todoId = z.string().parse(req.params.id)

    await TodoModel.findOneAndDelete({
      _id: todoId,
      userId: req.userId
    })

    return res
      .status(OK)
      .json({ message: "Todo deleted successfully" })
  }
)

const getTodoHandler = AsyncHandler(
  async (req, res) => {

    const todos = await TodoModel.find({
      userId: req.userId
    })

    return res
      .status(OK)
      .json(todos)
  }
)

export { addTodoHandler, updateTodoHandler, deleteTodoHandler, getTodoHandler }