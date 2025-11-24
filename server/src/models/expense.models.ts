import { Schema, model, Document } from "mongoose";

export interface IExpense extends Document {
  shopId: string;
  clientId: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    shopId: { type: String, ref: "Shop", required: true },
    clientId: { type: String, ref: "User", required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    category: { type: String },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IExpense>("Expense", expenseSchema);
