
function getEnv(key: string, defaultValue?: string) {
  const value = process.env[key] || defaultValue
  if (value === undefined) {
    throw new Error(`ENV ${key} is missing`)
  }
  return value;
}

export const PORT = getEnv("PORT", "4000")
export const NODE_ENV = getEnv("NODE_ENV")
export const CORS_ORIGIN = getEnv("CORS_ORIGIN")
export const MONGODB_URI = getEnv("MONGODB_URI")
export const JWT_ACCESS_SECRET = getEnv("JWT_ACCESS_SECRET")
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET")
export const EMAIL_SENDER = getEnv("EMAIL_SENDER")
export const RESEND_API_KEY = getEnv("RESEND_API_KEY")