import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { register } from "../api/auth.api"

export default function Register() {

  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const navigate = useNavigate()

  const { mutate: createAccount, isPending, isError, error } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate("/", { replace: true })
    }
  })

  return (
    <div className=" min-h-screen flex flex-col items-center justify-center gap-5 text-sm">
      <h2 className="text-2xl font-bold ">Create a new account</h2>
      <div className="flex flex-col gap-3 border border-neutral-600 rounded-lg p-5 bg-[#242f36]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createAccount({ username, email, password, confirmPassword })
          }}
          className="w-80 flex flex-col gap-4"
        >

          <div className="flex flex-col gap-2">
            <label htmlFor="username" >Username</label>
            <input
              type="text"
              id="username"
              className="border p-2 border-neutral-600 rounded-md"
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" >Email address</label>
            <input
              type="email"
              id="email"
              className="border p-2 border-neutral-600 rounded-md"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label htmlFor="password">Password</label>
              <span className=" text-neutral-400 text-[11px] mt-1">*Password must be more than 6 charaters</span>
            </div>
            <input
              type="password"
              id="password"
              className="border p-2 border-neutral-600 rounded-md"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              id="password"
              className="border p-2 border-neutral-600 rounded-md"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {isError && <span className=" text-red-500 text-xs">{error.message}</span>}
          <button
            disabled={!username || !email || password.length < 6 || password !== confirmPassword}
            className={`${!username || !email || password.length < 6 || password !== confirmPassword ? "bg-blue-900 text-neutral-300" : "bg-blue-800 cursor-pointer"} p-1.5 rounded-sm `}>{isPending ? "Creating Account..." : "Create Account"}</button>
        </form>

        <span className="self-center">Already have an account? &nbsp;
          <Link className="text-blue-500" to="/login">Sign in</Link>
        </span>
      </div>
    </div>
  )
}
