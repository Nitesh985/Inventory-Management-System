import { Schema, Types, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure one budget per category per shop
budgetSchema.index({ shopId: 1, category: 1 }, { unique: true });

export default model<IBudget>('Budget', budgetSchema);
