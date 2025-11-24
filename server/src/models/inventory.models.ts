import { Schema, model, Document } from "mongoose";

export interface IInventory extends Document {
  id: string;
  shopId: string;
  productId: string;
  stock: number;
  reserved: number;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    shopId: { type: String, ref: "Shop", required: true },
    productId: { type: String, ref: "Product", required: true },
    stock: { type: Number, required: true },
    reserved: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<IInventory>("Inventory", inventorySchema);
