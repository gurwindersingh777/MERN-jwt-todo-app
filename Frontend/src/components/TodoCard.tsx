import { useMutation } from "@tanstack/react-query";
import type { GetTodo } from "../types/todos.types";
import { deleteTodo, updateTodo } from "../api/auth.api";
import { useState } from "react";
import { queryClient } from "../config/queryClient";
import { TODO } from "../hooks/useTodo";


export default function TodoCard({ todo }: { todo: GetTodo }) {


  const [title, setTitle] = useState<string>(todo.title)
  const [description, setDescription] = useState<string>(todo.description)
  const [completed, setCompleted] = useState<boolean>(todo.completed)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const { mutate: updateTodoMutation } = useMutation({
    mutationFn: () => updateTodo({ title, description, completed }, todo._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODO] })
      setIsEditing(false)
    }
  })

  const { mutate: deleteTodoMutation } = useMutation({
    mutationFn: () => deleteTodo(todo._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODO] })
    }
  })

  return (
    <>
      {isEditing ?
        <>
          <div className="flex border border-neutral-400 items-center justify-between text-xs px-6 p-2.5 gap-3">
            <div className=" flex flex-col  gap-1">
              <input
                className="border p-1 px-2 rounded w-full mb-2"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                className="border p-1 px-2 rounded w-full mb-2"
                value={description}
                placeholder="description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span
                onClick={() => updateTodoMutation()}
                className=" text-[15px] p-0.5 hover:bg-red-900 cursor-pointer">✅</span>
              <span
                onClick={() => setIsEditing(prev => !prev)}
                className="border border-neutral-500 text-[9px] p-0.5 hover:bg-red-900 cursor-pointer">❌</span>
            
            </div>
          </div>
        </> :
        <div className="flex border border-neutral-400 items-center justify-between text-xs px-6 p-2.5 gap-3">
          <div className=" flex flex-col  gap-1">
            <span className={`text-[15px] ${completed ? 'text-neutral-400 line-through' : 'text-white'}`}>{title}</span>
            <span className="text-neutral-400">{description}</span>
          </div>
          <div className="flex items-center gap-2">

            <input
              type="checkbox"
              checked={completed}
              onChange={() => {
                setCompleted(prev => !prev)
                updateTodoMutation()
              }} />

            <span
              onClick={() => setIsEditing((prev) => !prev)}
              className="border border-neutral-500 text-[8px] p-0.5 hover:bg-green-900 cursor-pointer">✏️ </span>
            <span
              onClick={() => deleteTodoMutation()}
              className="border border-neutral-500 text-[8px] p-0.5 hover:bg-red-900 cursor-pointer">❌</span>
          </div>
        </div>
      }
    </>
  )
}
