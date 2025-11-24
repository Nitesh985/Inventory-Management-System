import { Schema, model, Document } from "mongoose";

export interface ICustomer extends Document {
  shopId: string;
  clientId: string;
  name: string;
  phone: string;
  address: string;
  outstandingBalance: number;
  notes: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    shopId: { type: String, ref: "Shop", required: true },
    clientId: { type: String, ref: "User", required: true },
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    outstandingBalance: { type: Number, default: 0 },
    notes: { type: String },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<ICustomer>("Customer", customerSchema);
