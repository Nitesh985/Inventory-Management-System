import { Schema, model, Types, Document } from "mongoose";

export interface ISupplier extends Document {
  name: string;
  phone?: string;
  email?: string;
  address?: string;

  notes?: string;

  deleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema = new Schema<ISupplier>(
  {
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

export default model<ISupplier>("Supplier", SupplierSchema);
