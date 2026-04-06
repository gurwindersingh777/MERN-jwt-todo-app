import SessionCard from "../components/SessionCard"
import { useSessions } from "../hooks/useSessions"


export default function Setting() {

  const { sessions = [], isError, isPending, isSuccess } = useSessions()

  if (isPending) return <div>Loading...</div>

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col justify-center  mt-10 gap-3 ">
        <h2 className="text-2xl font-bold">Sessions</h2>
        {isError && <span className="text-red-400">Failed to get Session.</span>}
        {isSuccess && sessions.map((session) => (
          <SessionCard key={session._id} session={session} />
        )
        )}
      </div>
    </div>
  )
}
