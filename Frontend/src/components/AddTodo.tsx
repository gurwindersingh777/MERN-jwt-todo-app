import { useMutation } from "@tanstack/react-query"
import { addTodo } from "../api/auth.api"
import { useState } from "react"
import { queryClient } from "../config/queryClient"
import { TODO } from "../hooks/useTodo"

export default function AddTodo() {

  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const { mutate: addTodoMutation } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : [TODO]})
      setTitle("")
      setDescription("")
    }
  })

  return (
    <div className="w-1/2">
      <form onSubmit={(e) => {
        e.preventDefault();
        addTodoMutation({ title, description });
      }} className="flex flex-col ">
        <input
          type="text"
          placeholder="Title"
          className="border p-1 px-2 rounded w-full mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="border p-1 px-2 rounded w-full mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Add</button>
      </form>
    </div>
  )
}
