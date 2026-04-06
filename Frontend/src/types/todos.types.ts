export type Todo = {
  title: string
  description: string
}

export type GetTodo = {
  _id: string
  title: string
  description: string
  completed: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
  __v: string
}

export type UpdateTodo = {
  title?: string
  description?: string
  completed?: boolean
}