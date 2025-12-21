import { Schema, model, Types, Document } from "mongoose";

export type PaymentMethod = "CASH" | "ESEWA" | "KHALTI" | "FONEPAY" | "BANK_TRANSFER" | "CARD";


export type PaymentFor = "CUSTOMER" | "SUPPLIER";

export interface IPayment extends Document {
  shopId: Types.ObjectId;

  // Who this payment is for
  partyType: PaymentFor;
  partyId: Types.ObjectId;

  amount: number;

  method: PaymentMethod;

  note?: string;

  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },

    partyType: {
      type: String,
      enum: ["CUSTOMER", "SUPPLIER"],
      required: true,
      index: true,
    },

    partyId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    method: {
      type: String,
      enum: ["CASH", "ESEWA", "KHALTI", "FONEPAY", "BANK_TRANSFER", "CARD"],
      required: true,
    },

    note: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default model<IPayment>("Payment", PaymentSchema);
