import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { resetPassword } from "../api/auth.api";
import { Link, useSearchParams } from "react-router-dom";

export default function ResetPassword() {

  const [searchParams] = useSearchParams()
  const code = searchParams.get("code")
  const exp = Number(searchParams.get("exp")) 
  const isLinkValid = code && exp && exp > Date.now()

  const [password, setPassword] = useState<string>("")

  const {
    mutate: resetUserPassword,
    isPending,
    isSuccess,
    isError,
    error
  } = useMutation({
    mutationFn: resetPassword
  })

  return (
    <div className=" min-h-screen flex flex-col items-center justify-center gap-5 text-sm">
      {isLinkValid ?
        <div className="flex flex-col gap-3 border border-neutral-600 rounded-lg p-5 bg-[#242f36]">
          <h2 className="text-2xl font-bold">Change your password</h2>
          {isSuccess ?
            <div className="flex flex-col items-center gap-3">
              <span className="bg-green-300/20 p-3 rounded-md">✅ Password updated successfully!</span>
              <Link className="text-blue-500" to="/login">Sign in</Link>
            </div>
            :
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  resetUserPassword({ password, verificationCode: code as string })
                }}
                className="w-80 flex flex-col gap-4"
              >
                {isError && <span className="text-sm text-red-600">{error?.message}</span>}
                <div className="flex flex-col gap-2">
                  <label className="text-xs" htmlFor="email">New Password</label>
                  <input
                    type="text"
                    id="password"
                    className="border p-2 border-neutral-600 rounded-md"
                    placeholder="Create a new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  disabled={!password}
                  className={`${password.length < 6 ? "bg-blue-900 text-neutral-300" : "bg-blue-800 cursor-pointer"} p-1.5 rounded-sm `}>{isPending ? "..." : "Reset Password"}</button>
              </form>
            </>}

        </div>
        : <>
          <span className="bg-red-300/20 p-3 rounded-md">⚠️ Invalid Link.</span>
          <span className="self-center">This link is either invalid or expired</span>
          <Link className="text-blue-500" to="/password/forgot">Request a new password reset link</Link>
        </>}
    </div>
  )
}
