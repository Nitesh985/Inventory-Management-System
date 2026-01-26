import { Schema, model, Document } from "mongoose";


export interface IUser extends Document {
  fullName: string;
  email: string;
  contactNo?: string;
  lastLoginAt: Date;
  hasCompletedTour?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNo: { type: String },
    lastLoginAt: { type: Date, default: null },
    hasCompletedTour: { type: Boolean, default: false },
  },
  { timestamps: true }
);


export default model<IUser>("User", userSchema);
