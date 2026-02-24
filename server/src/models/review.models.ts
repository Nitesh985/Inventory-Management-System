import { Schema, Types, model, Document } from "mongoose";

export interface IReview extends Document {
  shopId: Types.ObjectId;
  userId: Types.ObjectId;
  stars: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

// One review per user per shop
reviewSchema.index({ shopId: 1, userId: 1 }, { unique: true });

export default model<IReview>("Review", reviewSchema);
