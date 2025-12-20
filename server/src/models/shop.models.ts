import { Schema, model, Document } from "mongoose";

export interface IShop extends Document {
  name: string;
  useBS: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const shopSchema = new Schema<IShop>(
  {
    name: { type: String, required: true },
    useBS: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IShop>("Shop", shopSchema);
