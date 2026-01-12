// models/EmailOtp.ts
import mongoose from "mongoose";

const EmailOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  hashedCode: { type: String, required: true },
  expiresAt: {
    type: Date,
    required: true,
    unique: true,
    index: { expires: 0 }, // TTL
  },
  attempts:{
    type: Number,
    default: 0
  }
});

export const EmailOtp = mongoose.model("EmailOtp", EmailOtpSchema);
