import { z } from 'zod'

export const registerSchema = z
  .object({
    username: z.string().min(5).max(20),
    email: z.string().email().max(254),
    password: z.string().min(6).max(100),
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
    email: z.string().email().max(254),
    password: z.string().min(6).max(100),
    userAgent: z.string().optional()
  })