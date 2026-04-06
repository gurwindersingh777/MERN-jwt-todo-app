export type Session = {
  _id: string
  userId: string
  isCurrent?: boolean
  userAgent?: string
  createdAt: Date
  expiresAt: Date
}