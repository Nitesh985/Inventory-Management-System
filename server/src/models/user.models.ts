import { Schema, model, Document } from "mongoose";


export interface IUser extends Document {
  name: string;
  email: string;
  contactNo: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNo: { type: String, required: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);


export default model<IUser>("User", userSchema);
