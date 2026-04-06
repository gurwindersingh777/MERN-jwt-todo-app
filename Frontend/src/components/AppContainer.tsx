import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function AppContainer() {

  const { user, isLoading } = useAuth()

  return (
    <>
      {isLoading ? <span>Loading...</span>
        : user ?
          <Outlet /> :
          <Navigate to="/login" replace state={{ redirect: window.location.pathname }} />}
    </>
  )
}
