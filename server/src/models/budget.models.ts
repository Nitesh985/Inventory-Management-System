import { Schema, Types, model, Document } from "mongoose";

export interface IBudget extends Document {
  shopId: Types.ObjectId;
  category: string;
  categoryName: string;
  limit: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    category: { type: String, required: true },
    categoryName: { type: String, required: true },
    limit: { type: Number, required: true },
    period: { type: String, enum: ['monthly', 'quarterly', 'yearly'], default: 'monthly' },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Ensure one budget per category per shop
budgetSchema.index({ shopId: 1, category: 1 }, { unique: true });

export default model<IBudget>("Budget", budgetSchema);
