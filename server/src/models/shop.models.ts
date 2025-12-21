import { Schema, Types, model, Document } from "mongoose";

export type BusinessType = "Retail Store" | "Service Provider" | "Manufacturing" | "Restaurant/Food" | "Healthcare" | "Other"


export interface IShop extends Document {
  name: string;
  useBS: boolean;
  ownerId: Types.ObjectId;
  businessType: BusinessType;
  supplierIds: [Types.ObjectId];
  createdAt: Date;
  updatedAt: Date;
}

const shopSchema = new Schema<IShop>(
  {
    name: { type: String, required: true },
    useBS: { type: Boolean, default: false },
    ownerId: { type: Schema.Types.ObjectId, ref:"User", required: true },
    businessType: { type: String, enum: ["Retail Store", "Service Provider", "Manufacturing", "Restaurant/Food", "Healthcare", "Other"], required:true },
    supplierIds: [
      { type: Schema.Types.ObjectId, ref: "Supplier"}
    ]
  },
  { timestamps: true }
);

export default model<IShop>("Shop", shopSchema);
