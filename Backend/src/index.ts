import 'dotenv/config'
import express from 'express'
import connectToDB from './config/db.js'
import { CORS_ORIGIN, PORT } from './constants/env.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler.js'
import { OK } from './constants/statusCode.js'

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({ origin: CORS_ORIGIN, credentials: true }))

// health route
app.get("/health", (req, res, next) => {
  return res.status(OK).json({ status: "OK" })
})

// routes
import authRouter from "./routes/auth.routes.js"

app.use("/auth", authRouter)
app.use(errorHandler)

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
})