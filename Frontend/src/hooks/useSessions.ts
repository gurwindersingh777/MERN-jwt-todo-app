import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteSession, getSessions } from "../api/auth.api"
import type { Session } from "../types/sessions.types"

const SESSIONS = "sessions"

export const useSessions = (options = {}) => {
  const { data: sessions, ...rest } = useQuery<Session[]>({
    queryFn: getSessions,
    queryKey: [SESSIONS],
    ...options
  })

  return { sessions, ...rest }
}

export const useDeleteSession = (sessionId: string) => {
  const queryClient = useQueryClient()
  const { mutate, ...rest } = useMutation({
    mutationFn: () => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS] })
    }
  })

  return { deleteSession: mutate, ...rest }
}