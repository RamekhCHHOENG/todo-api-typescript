import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ITodo extends Document {
  id: string;
  todo: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

const todoSchema: Schema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  todo: { type: String, required: true, unique: true },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: null }
});

export default mongoose.model<ITodo>('Todo', todoSchema);
