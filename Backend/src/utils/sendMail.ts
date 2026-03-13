import resend from "../config/resend.js"
import { EMAIL_SENDER, NODE_ENV, TEST_EMAIL } from "../constants/env.js"

type SendMailProps = {
  to: string
  subject: string
  text: string
  html: string
}


export const sendMail = async ({ to, subject, text, html }: SendMailProps) =>
  await resend.emails.send({
    from: EMAIL_SENDER,
    to: NODE_ENV === "development" ? TEST_EMAIL : to,
    subject,
    text,
    html
  })
