import { model, Schema, Document} from "mongoose";

export interface Book extends Document {
  name: string;
  author: Schema.Types.ObjectId | string,
  publisher:Schema.Types.ObjectId | string;
  pages?: string;
  format: string;
  lenguage: string;
  publication_year?: string;
}

const books_schema = new Schema({
  name: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, required: true, ref:"authors" },
  publisher: { type: Schema.Types.ObjectId, required: true, ref:"publishers"},
  pages: { type: String, required: true },
  format: { type: String, required: true },
  language: { type: String, required: true },
  publication_year: { type: String, default: null },
  registration_date: { type: Date, required: true, default: Date() },
  discharge_date: { type: Date, default: null },
});

export const book_model = model<Book>("books", books_schema);

