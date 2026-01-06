import { Schema, Types, model, Document } from "mongoose";

export interface ICredit extends Document {
  shopId: Types.ObjectId;
  customerId: Types.ObjectId;
  amount: number; // Positive = customer owes (gave credit), Negative = customer paid (got payment)
  description: string;
  date: Date;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const creditSchema = new Schema<ICredit>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    amount: { type: Number, required: true }, // +ve = credit given, -ve = payment received
    description: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound index for efficient queries
creditSchema.index({ shopId: 1, customerId: 1, deleted: 1 });

export default model<ICredit>("Credit", creditSchema);
