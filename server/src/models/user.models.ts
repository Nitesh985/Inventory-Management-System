import { Schema, Types, model, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email: string;
  passwordHash: string;
  image?: string | null;
  activeShopId?: Types.ObjectId | null;
  hasCompletedTour: boolean;
  onBoardingCompleted: boolean;
  emailVerified: boolean;
  role: string;
  refreshTokenHash?: string | null;
  refreshTokenExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    image: { type: String, default: null },
    activeShopId: { type: Schema.Types.ObjectId, ref: 'Shop', default: null },
    hasCompletedTour: { type: Boolean, default: false },
    onBoardingCompleted: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
    refreshTokenHash: { type: String, default: null },
    refreshTokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
