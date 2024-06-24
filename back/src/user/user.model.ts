import { Schema, Document, Types } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
}

export const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
},{ collection: 'users' });
