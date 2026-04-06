import { useTodo } from "../hooks/useTodo";
import AddTodo from "./AddTodo";
import TodoCard from "./TodoCard";

export default function Todo() {

  const { todos, isPending, isError, isSuccess } = useTodo()

  return (
    <div className="m-5">
      <h1 className="text-2xl font-semibold mb-5">Todos</h1>
      <div className="flex gap-2 flex-col  w-11/12 p-2">
        <AddTodo />
        {isError && <span className="text-red-400">Failed to get todos</span>}
        {isPending && <span className="text-blue-400">Loading...</span>}
        {isSuccess && todos && todos.length > 0 ? todos.map((todo) => (
          <TodoCard key={todo._id} todo={todo} />
        )) : <span className="text-neutral-600 self-center">There is no todo</span>}
      </div>
    </div>
  )
}
