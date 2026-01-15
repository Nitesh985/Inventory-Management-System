import { Schema, Types, model, Document } from "mongoose";

export type BusinessType = "Retail Store" | "Service Provider" | "Manufacturing" | "Restaurant/Food" | "Healthcare" | "Other"


export interface IShop extends Document {
  name: string;
  useBS: boolean;
  ownerId: Types.ObjectId;
  businessType: BusinessType;
  supplierIds: [Types.ObjectId];
  // Business Profile Fields
  panNumber?: string;        
  vatNumber?: string; 
  currency: string;       
  address?: string;
  city?: string;
  district?: string;
  province?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const shopSchema = new Schema<IShop>(
  {
    name: { type: String, required: true },
    useBS: { type: Boolean, default: false },
    ownerId: { type: Schema.Types.ObjectId, ref:"User", required: true },
    businessType: { type: String, enum: ["Retail Store", "Service Provider", "Manufacturing", "Restaurant/Food", "Healthcare", "Other"], default: "Other" },
    supplierIds: [
      { type: Schema.Types.ObjectId, ref: "Supplier"}
    ],
    // Business Profile Fields
    panNumber: { type: String, default: "" },
    vatNumber: { type: String, default: "" },
    currency: { type: String, default: "NPR" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    district: { type: String, default: "" },
    province: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
  },
  { timestamps: true }
);

export default model<IShop>("Shop", shopSchema);
