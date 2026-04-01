import { useAuth } from "../hooks/useAuth"

export default function AppContainer() {

  const { user, isLoading } = useAuth()
  return (
    <div>AppContainer</div>
  )
}
