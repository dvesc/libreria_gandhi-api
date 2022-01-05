import { model, ObjectId, Schema } from "mongoose";

export interface Publisher extends Document {
  _id: ObjectId;
  name: string;
}

const publishers_schema = new Schema({
  name: { type: String, required: true },
  registration_date: { type: Date, required: true, default: Date()},
  discharge_date: { type: Date, default: null }
});


export const publisher_model = model<Publisher>(
  "publishers", publishers_schema
);