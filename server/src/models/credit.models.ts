import { Schema, Types, model, Document } from "mongoose";

export interface ICredit extends Document {
  shopId: Types.ObjectId;
  customerId: Types.ObjectId;
  saleId?: Types.ObjectId;
  type: "CREDIT" | "PAYMENT";
  amount: number; // Always positive. Type determines if it's owed or paid.
  description: string;
  paymentMethod?: string;
  date: Date;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const creditSchema = new Schema<ICredit>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    saleId: { type: Schema.Types.ObjectId, ref: "Sales", default: null },
    type: { type: String, enum: ["CREDIT", "PAYMENT"], required: true },
    amount: { type: Number, required: true }, // Always positive
    description: { type: String, default: "" },
    paymentMethod: { type: String },
    date: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound index for efficient queries
creditSchema.index({ shopId: 1, customerId: 1, deleted: 1 });
creditSchema.index({ shopId: 1, type: 1, deleted: 1 });

export default model<ICredit>("Credit", creditSchema);
