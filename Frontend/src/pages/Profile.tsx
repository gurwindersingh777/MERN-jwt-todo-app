import { useAuth } from "../hooks/useAuth"

export default function Profile() {

  const { user, isLoading } = useAuth()
  const { verified, email, createdAt } = user || {}
  
  if (isLoading) return <div>Loading...</div>

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="flex flex-col justify-center items-center text-sm mt-20 gap-1">
        <h2 className="font bold text-xl">My Account</h2>
        {verified ? <span className="bg-green-300/20 p-2 rounded-md">✅ Verfied</span> : <span className="border p-1.5 rounded-md border-neutral-500 text-sm bg-red-300/20">
          ⚠️ Please verify your email
        </span>}
        {email && <span>Email :{email}</span>}
        {createdAt && <span>Created on : {new Date(createdAt).toLocaleDateString()}</span>}
      </div>
    </div>
  )
}
