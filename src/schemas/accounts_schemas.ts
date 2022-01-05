import { model, Schema, Document } from "mongoose";

interface Account extends Document {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  registration_date: string;
  addresses?: any[];
  cards?: any[];
}

//SCHEMAS----------------------------------------------------------------------
const numbers_schema = new Schema({
  number: { type: Number, unique: true, required: true },
  country: { type: String, required: true },
  calling_code: { type: String, required: true },
});

const addresses_schema = new Schema({
  addressee: { type: String, required: true },
  city: { type: String, default: null },
  state: {type: String, default: null},
  country: { type: String, default: null },
  street: { type: String, default: null },
  registration_date: { type: Date, default: Date.now, required: true },
  discharge_date: { type: Date, default: null },
});

const cards_schema = new Schema({
  number: { type: Number, required: true, unique: true },
  security_code: { type: Number, required: true },
  expiration_date: { type: Date, required: true },
  titular_name: { type: String, required: true },
  registration_date: { type: Date, default: Date.now, required: true },
  discharge_date: { type: Date, default: null },
});

const account_schema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: numbers_schema,
  password: { type: String, required: true },
  registration_date: { type: Date, default: Date.now, required: true },
  register_at: { type: Date, default: null },
  addresses: {type: [addresses_schema]},
  cards:{type: [cards_schema]}
});

//MODEL------------------------------------------------------------------------
export const account_model = model<Account>("Accounts", account_schema);
