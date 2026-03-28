import mongoose from "mongoose";

interface TodoDocument extends mongoose.Document {
  title: string
  description: string
  completed: boolean
  userId: mongoose.Types.ObjectId
}

const todoSchema = new mongoose.Schema<TodoDocument>({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true }
)

export const TodoModel = mongoose.model<TodoDocument>("Todo", todoSchema) 