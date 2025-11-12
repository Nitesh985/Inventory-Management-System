import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  id: string;
  shopId: string;
  clientId: string;
  sku: string;
  name: string;
  category: string;
  unit: number;
  price: number;
  cost: number;
  reorderLevel: number;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    shopId: { type: String, ref: "Shop", index: true, required: true },
    clientId: { type: String, ref: "User", required: true },
    sku: { type: String },
    name: { type: String, index: true, required: true },
    category: { type: String },
    unit: { type: Number, required: true },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    reorderLevel: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IProduct>("Product", productSchema);
