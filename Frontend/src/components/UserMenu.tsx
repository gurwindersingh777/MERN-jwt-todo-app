import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { logout } from "../api/auth.api"
import { queryClient } from "../config/queryClient"

export default function UserMenu() {

  const navigate = useNavigate()
  const { mutate: logoutUser } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear()
      navigate("/", { replace: true })
    }
  })

  return (
    <>
      <div className="flex flex-col absolute right-5 top-5  cursor-pointer p-1 gap-1 text-sm">
        <span className="hover:bg-blue-950 border border-neutral-500  p-1" onClick={() => navigate("/profile")}>Profile</span>
        <span className="hover:bg-blue-950 border border-neutral-500  p-1" onClick={() => navigate("/setting")}>Setting</span>
        <span className="hover:bg-blue-950 border border-neutral-500  p-1" onClick={() => logoutUser()}>Logout</span>
      </div>
    </>  
  )
}
