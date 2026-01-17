import { Schema, Types, model, Document } from "mongoose";

export interface IInventory extends Document {
  shopId: Types.ObjectId;
  productId: Types.ObjectId;
  stock: number;
  minStock?: number;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    minStock: { type: Number },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default model<IInventory>("Inventory", inventorySchema);
