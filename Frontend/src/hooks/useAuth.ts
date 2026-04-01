import { useQuery } from "@tanstack/react-query"
import { getUser } from "../api/auth.api"

const AUTH = "auth"

export const useAuth = (options = {}) => {
  const { data: user, ...rest } = useQuery({
    queryKey: [AUTH],
    queryFn: getUser,
    staleTime: Infinity,
    ...options
  })

  return { user, ...rest }
}