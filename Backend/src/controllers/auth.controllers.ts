import { CREATED } from "../constants/statusCode.js"
import registerSchema from "../schema/authSchema.js"
import registerUser from "../services/auth.service.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import { setAuthCookies } from "../utils/cookies.js"

const registerHandler = AsyncHandler(

  async (req, res) => {
    
    const request = registerSchema.parse({ ...req.body, userAgent: req.header("user-agent") })

    const { user, accessToken, refreshToken } = await registerUser(request)

    setAuthCookies({ res, accessToken, refreshToken })

    return res
      .status(CREATED)
      .json(user)
  }
)
export { registerHandler }