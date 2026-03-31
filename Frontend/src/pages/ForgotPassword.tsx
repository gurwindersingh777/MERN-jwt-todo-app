import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "../api/auth.api";

export default function ForgotPassword() {

  const [email, setEmail] = useState<string>("")
  const { mutate: sendPasswordReset, isSuccess, isPending, isError, error } = useMutation({
    mutationFn: sendPasswordResetEmail
  })

  return (
    <div className=" min-h-screen flex flex-col items-center justify-center gap-5 text-sm">
      <h2 className="text-2xl font-bold ">Reset your password</h2>
      <div className="flex flex-col gap-3 border border-neutral-600 rounded-lg p-5 bg-[#242f36]">
        {isSuccess ? <>
          <span className="bg-green-300/20 p-3 rounded-md">✅ Email sent successfully! Check your inbox.</span>
        </> :
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendPasswordReset({ email })
            }}
            className="w-80 flex flex-col gap-4"
          >

            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email address</label>
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


            {isError && <span className="text-red-500 text-xs">{error.message}</span>}

            <button
              disabled={!email}
              className={`${!email ? "bg-blue-900 text-neutral-300" : "bg-blue-800 cursor-pointer"} p-1.5 rounded-sm `}>{isPending ? "..." : "Reset Password"}</button>
          </form>
        }

        <span className="self-center">Go back to &nbsp;
          <Link className="text-blue-500" to="/register">Sign up</Link> or &nbsp;
          <Link className="text-blue-500" to="/login">Sign in</Link>
        </span>
      </div>
    </div>
  )
}
