import { Schema, Types, model, Document } from "mongoose";

export interface IProduct extends Document {
  shopId: Types.ObjectId;
  supplierId: Types.ObjectId;
  categoryId: Types.ObjectId;
  sku: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    supplierId: { type: Schema.Types.ObjectId, ref:"Supplier" },
    sku: { type: String, required: true },
    name: { type: String, index: true, required: true },
    category: { type: String, required: true },
    description: {type: String},
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index(
  { shopId: 1, sku:1 },
  { unique: true }
)

export default model<IProduct>("Product", productSchema);
