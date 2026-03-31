import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth.api";

export default function Login() {

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const navigate = useNavigate()

  const { mutate: signin, isError, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/", { replace: true })
    },
  })

  return (
    <div className=" min-h-screen flex flex-col items-center justify-center gap-5 text-sm">
      <h2 className="text-2xl font-bold ">Sign in to your account</h2>
      <div className="flex flex-col gap-3 border border-neutral-600 rounded-lg p-5 bg-[#242f36]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signin({ email, password })
          }}
          className="w-80 flex flex-col gap-4"
        >

          <div className="flex flex-col gap-2">
            <label htmlFor="email" >Email address</label>
            <input
              type="email"
              id="email"
              className="border p-2 border-neutral-600 rounded-md"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="border p-2 border-neutral-600 rounded-md"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between">
            <Link className="self-end text-blue-500" to="/password/forgot">Forgot password?</Link>
            {isError && <span className="text-red-500 text-xs">Invalid email or password</span>}
          </div>
          <button
            disabled={!email || password.length < 6}
            className={`${!email || password.length < 6 ? "bg-blue-900 text-neutral-300" : "bg-blue-800 cursor-pointer"} p-1.5 rounded-sm `}>{isPending ? "Signing..." : "Sign in"}</button>
        </form>

        <span className="self-center">Don't have an account? &nbsp;
          <Link className="text-blue-500" to="/register">Sign up</Link>
        </span>
      </div>
    </div>
  )
}
