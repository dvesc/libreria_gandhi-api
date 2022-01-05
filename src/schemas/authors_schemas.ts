import { model, ObjectId, Schema } from "mongoose";

export interface Author extends Document {
  _id: ObjectId;
  name: string;
  birthday: string;
  gender: string;
  language: string;
}

const authors_schema = new Schema({
  name: { type: String, required: true },
  birthday: { type: Date, default: null },
  gender: { type: String, required: true },
  language: { type: String, required: true },
  registration_date: { type: Date, required: true, default: Date() },
  discharge_date: { type: Date, default: null },
});

export const author_model = model<Author>("authors", authors_schema);
