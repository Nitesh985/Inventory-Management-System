import { Schema, model, Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    description: {type: String}
  },
  { timestamps: true }
);

export default model<ICustomer>("Category", categorySchema);
