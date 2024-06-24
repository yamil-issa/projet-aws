import { Schema, Document, Types } from 'mongoose';

export interface Task extends Document {
  title: string;
  description: string;
  completed: boolean;
  user: Types.ObjectId;
}

export const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
},{ collection: 'tasks' });
