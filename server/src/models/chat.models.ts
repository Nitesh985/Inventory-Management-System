import { Schema, model, Document, Types } from "mongoose";

export interface IMessage {
  id: string;
  type: 'system' | 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  userId: Types.ObjectId;
  shopId: Types.ObjectId;
  title: string;
  messages: IMessage[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  id: { type: String, required: true },
  type: { type: String, enum: ['system', 'user', 'ai'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const chatSchema = new Schema<IChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    title: { type: String, required: true },
    messages: { type: [messageSchema], default: [] },
    isArchived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Index for faster queries
chatSchema.index({ userId: 1, shopId: 1, isArchived: 1 });
chatSchema.index({ title: 'text', 'messages.content': 'text' });

export default model<IChat>("Chat", chatSchema);
