import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { verifyEmail } from "../api/auth.api";

export default function VerifyEmail() {

  const { code } = useParams()

  const { isPending, isError, isSuccess } = useQuery({
    queryFn: () => verifyEmail(code as string),
    queryKey: ["emailVerification", code]
  })
  return (
    <div className="flex p-10 justify-center">
      <div className="flex flex-col w-fit items-center gap-3 mt-10">
        {isPending ? "Verifying..." :
          <>
            {isSuccess ?
              <span className="border p-1.5 rounded-md border-neutral-500 text-sm bg-green-300/20">
                ✅ Email verified!
              </span>
              :
              <>
                <span className="border p-1.5 rounded-md border-neutral-500 text-sm bg-red-300/20">
                  ⚠️ invalid link!
                </span>
                {isError &&
                  <span className="text-xs text-neutral-300">The link in either invalid or expire. <Link to="/password/forgot" replace className="text-blue-400  hover:underline">Get a new link</Link></span>
                }
              </>

            }
          </>
        }
        <Link className="text-blue-400 text-sm hover:underline" to="/" replace>Back to home</Link>
      </div>
    </div>
  )
}
