import mongoose from "mongoose";
import bcrypt from 'bcrypt'

export interface UserDocument extends mongoose.Document {
  username: string
  email: string
  password: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(val: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    verified: { type: Boolean, required: true, default: false },
    password: { type: String, required: true, select: false }
  },
  {
    timestamps: true
  })


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

export const UserModel = mongoose.model<UserDocument>("User", userSchema)