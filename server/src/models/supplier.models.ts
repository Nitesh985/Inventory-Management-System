import { Schema, model, Types, Document } from "mongoose";

export interface ISupplier extends Document {
  shopId: Types.ObjectId;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  address?: string;
  notes?: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema = new Schema<ISupplier>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    company: {
      type: String,
      trim: true,
      default: null,
    },

    address: {
      type: String,
      default: null,
    },

    notes: {
      type: String,
      default: null,
    },

    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

SupplierSchema.index({ shopId: 1, deleted: 1 });

export default model<ISupplier>("Supplier", SupplierSchema);
