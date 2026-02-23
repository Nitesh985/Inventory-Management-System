import { Schema, model, Types, Document } from 'mongoose';

export type PaymentMethod = 'CASH' | 'ESEWA' | 'KHALTI';

export type PaymentFor = 'CUSTOMER' | 'SUPPLIER';

export interface IPayment extends Document {
  shopId: Types.ObjectId;
  salesId: Types.ObjectId;
  amount: number;
  method: PaymentMethod;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  createdAt: Date;
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true,
    },

    salesId: {
      type: Schema.Types.ObjectId,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    method: {
      type: String,
      enum: ['CASH', 'ESEWA', 'KHALTI'],
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IPayment>('Payment', PaymentSchema);
