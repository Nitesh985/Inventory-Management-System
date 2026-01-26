import { Schema, Types, model, Document } from "mongoose";

export interface ICustomer extends Document {
  shopId: Types.ObjectId;
  name: string;
  contact?: [string];
  email?: string;
  address?: string;
  notes?: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    name: { type: String, required: true },
    email: {type: String},
    contact: [{ type: String }],
    address: { type: String },
    notes: { type: String },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<ICustomer>("Customer", customerSchema);
