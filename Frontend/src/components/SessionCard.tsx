import { useDeleteSession } from "../hooks/useSessions";
import type { Session } from "../types/sessions.types";

export default function SessionCard({ session }: {session: Session}) {

  const { _id, userAgent, isCurrent, createdAt } = session

  const { deleteSession } = useDeleteSession(_id)

  return (
    <div className="flex border border-neutral-400 items-center text-xs p-2.5 gap-3">
      <div className=" flex flex-col  gap-1">
        {createdAt &&
          <span >{new Date(createdAt).toLocaleString()}
            {isCurrent && <span>{isCurrent && "(Current Session)"}</span>}
          </span>}
        {userAgent && <span className="text-neutral-400">{userAgent}</span>}
      </div>
      {!isCurrent && <span onClick={() => deleteSession()} className=" cursor-pointer">❌</span>}
    </div>
  )
}
