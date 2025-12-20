import { Schema, Types, model, Document } from "mongoose";

export interface ICustomer extends Document {
  shopId: Types.ObjectId;
  clientId: Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  address: string;
  outstandingBalance: number;
  notes: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: {type: String},
    phone: { type: String },
    address: { type: String },
    outstandingBalance: { type: Number, default: 0 },
    notes: { type: String },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<ICustomer>("Customer", customerSchema);
