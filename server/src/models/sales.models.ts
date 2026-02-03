import { Schema, Types, model, Document } from 'mongoose';

export interface ISaleItem {
  productId: Types.ObjectId; // fk -> Product.id
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const saleItemSchema = new Schema<ISaleItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: false }
);

export interface ISales extends Document {
  shopId: Types.ObjectId;
  customerId: Types.ObjectId;
  invoiceNo: string;
  items: ISaleItem[];
  totalAmount: number;
  paidAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'PARTIALLY_PAID' | 'REFUNDED' | 'CREDIT';
  discount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const salesSchema = new Schema<ISales>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    invoiceNo: { type: String, required: true },
    items: { type: [saleItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'CANCELLED'], default: 'COMPLETED' },
    discount: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

salesSchema.index({ shopId: 1, invoiceNo: 1 }, { unique: true });

export default model<ISales>('Sales', salesSchema);
