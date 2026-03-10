import mongoose from "mongoose";
import { VerificationType } from "../constants/verificationType.js";

interface VerificationCodeDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  type: VerificationType
  expiresAt: Date
  createdAt: Date
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  expiresAt: { type: Date, required: true }
})

export const VerificationCodeModel = mongoose.model<VerificationCodeDocument>("VerificationCode",verificationCodeSchema) 