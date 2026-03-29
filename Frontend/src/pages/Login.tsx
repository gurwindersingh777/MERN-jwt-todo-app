import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  return (
    <div className=" min-h-screen flex flex-col items-center justify-center gap-5 text-sm">
      <h2 className="text-2xl font-bold ">Sign in to your account</h2>
      <div className="flex flex-col gap-3 border border-neutral-600 rounded-lg p-5 bg-[#242f36]">
        <form className="flex flex-col gap-4">

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label htmlFor="email" >Email address</label>
              <span className="hidden text-red-700 text-xs">Enter a valid email</span>
            </div>
            <input
              type="text"
              id="email"
              className="w-70 border p-2 border-neutral-600 rounded-md"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label htmlFor="password">Password</label>
              <span className="hidden text-red-700 text-xs">Password must be more than 6 charaters</span>
            </div>
            <input
              type="password"
              id="password"
              className="w-70 border p-2 border-neutral-600 rounded-md"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className=" self-end text-blue-500">
            <Link to="/password/forgot">Forgot password?</Link>
          </div>
          <button
            disabled={!email || password.length < 6}
            className={`${!email || password.length < 6 ? "bg-blue-900 text-neutral-300" : "bg-blue-800 cursor-pointer"} p-1.5 rounded-sm `}>Sign in</button>
        </form>

        <span className="self-center">Don't have an account? &nbsp;
          <Link className="text-blue-500" to="/register">Sign up</Link>
        </span>
      </div>
    </div>
  )
}
