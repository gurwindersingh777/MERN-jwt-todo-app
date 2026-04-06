import { Route, Routes, useNavigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import VerifyEmail from "./pages/VerifyEmail"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import AppContainer from "./components/AppContainer"
import Setting from "./pages/Setting"
import Profile from "./pages/Profile"
import { setNavigate } from "./lib/navigation"

function App() {

  const navigate = useNavigate()
  setNavigate(navigate)

  return (
    <>
      <Routes>
        <Route path="/" element={<AppContainer />} >
          <Route index element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/setting" element={<Setting />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email/verify/:code" element={<VerifyEmail />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset" element={<ResetPassword />} />
      </Routes>
    </>
  )
}

export default App
