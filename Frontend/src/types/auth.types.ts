export type Login = {
  email: string
  password: string
}

export type Register = Login & {
  username: string
  confirmPassword: string
}

export type Email = {
  email: string
}

export type PasswordReset = {
  password: string
  verificationCode: string
}

export type User = {
  _id: string
  username: string
  email: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
}