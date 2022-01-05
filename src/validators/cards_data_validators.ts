import { Request, Response, NextFunction } from "express";
import * as valid from "card-validator";
import { send_error } from "../utils/response_utils";

const valid_number = (value: number): void => {
  if (!valid.number(value).isPotentiallyValid)
    throw new Error("Card number is not valid");
};

const valid_name = (value: string): void => {
  if (!valid.cardholderName(value).isPotentiallyValid)
    throw new Error("Titular name is not valid");
};

const valid_cvv = (value: number): void => {
  if (!valid.cvv(`${value}`).isPotentiallyValid)
    throw new Error("Security code is not valid");
};

const valid_date = (value: string): void => {
  if (!valid.expirationDate(value).isPotentiallyValid)
    throw new Error("Expiration date is not valid");
};

//-----------------------------------------------------------------------------
export const cards_data_middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { number, titular_name, expiration_date, security_code } = req.body,
      method = req.method;

    if (method === "PATCH") {
      if (number) valid_number(number);
      if (titular_name) valid_name(titular_name);
      if (security_code) valid_cvv(security_code);
      if (expiration_date) valid_date(expiration_date);
    } else {
      valid_number(number);
      valid_name(titular_name);
      valid_cvv(security_code);
      valid_date(expiration_date);
    }

    next();
  } catch (err) {
    send_error(res, err);
  }
};
