import { Schema, model, Document } from "mongoose";
import bcrypt from 'bcrypt'

export interface IUser extends Document {
  id: string;
  shopId: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;

  isPasswordCorrect(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    shopId: { type: String, ref: "Shop", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);


userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});


userSchema.methods.isPasswordCorrect = async function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export default model<IUser>("User", userSchema);
