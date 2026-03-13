import { z } from 'zod'

export const emailSchema = z.string().email().max(254)
export const passwordSchema = z.string().min(6).max(100)

export const registerSchema = z
  .object({
    username: z.string().min(5).max(20),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(6).max(100),
    userAgent: z.string().optional()
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Password do not match",
      path: ["confirmPassword"]
    });

export const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: z.string().optional()
  })

export const verificationCodeSchema = z.string().min(1).max(24)

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    verificationCode: verificationCodeSchema
  })