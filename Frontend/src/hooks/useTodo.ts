import { useQuery } from "@tanstack/react-query"
import { getTodo } from "../api/auth.api"

export const TODO = "Todo"

export const useTodo = () => {
  const { data: todos, ...rest } = useQuery({
    queryKey: [TODO],
    queryFn: getTodo
  })

  return { todos, ...rest }
}