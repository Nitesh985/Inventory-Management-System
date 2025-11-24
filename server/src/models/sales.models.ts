import { Schema, model, Document } from "mongoose";

export interface ISaleItem {
  productId: string; // fk -> Product.id
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const saleItemSchema = new Schema<ISaleItem>(
  {
    productId: { type: String, ref: "Product", required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: false }
);

// =========================
// Sales Model
// =========================
export interface ISales extends Document {
  shopId: string; // fk -> Shop.id
  clientId: string; // fk -> User.id
  customerId: string; // fk -> Customer.id
  invoiceNo: string;
  items: ISaleItem[];
  totalAmount: number;
  paidAmount: number;
  discount: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const salesSchema = new Schema<ISales>(
  {
    shopId: { type: String, ref: "Shop", required: true },
    clientId: { type: String, ref: "User", required: true },
    customerId: { type: String, ref: "Customer", required: true },
    invoiceNo: { type: String, required: true, unique: true },
    items: { type: [saleItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export default model<ISales>("Sales", salesSchema);
