import { Schema, Types, model, Document } from "mongoose";

export interface IExpense extends Document {
  shopId: Types.ObjectId;
  clientId: Types.ObjectId; 
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
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    category: { type: String },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IExpense>("Expense", expenseSchema);
