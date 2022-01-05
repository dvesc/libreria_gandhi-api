import { Response } from "express";
import { author_model } from "../schemas/authors_schemas";
import { send_error } from "../utils/response_utils";
import { Author } from "../schemas/authors_schemas";

const author = author_model;

export const create_author = async (
  res: Response,
  model: object
): Promise<void> => {
  try {
    author.create(model);
  } catch (err) {
    send_error(res, err);
  }
};
//-----------------------------------------------------------------------------
export const get_all_authors = async (
  res: Response,
  sort?: object
): Promise<Author[]> => {
  try {
    const coincidences: Author[] = await author
      .find({})
      .sort(sort);
    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_author_by_name = async (
  res: Response,
  value: string,
  sort?: object
): Promise<Author[]> => {
  try {
    const coincidences: Author[] = await author
      .find({ name: new RegExp(`${value}`, "i") })
      .sort(sort);
    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_author_by_gender = async (
  res: Response,
  value: string,
  sort?: object
): Promise<Author[]> => {
  try {
    const coincidences: Author[] = await author
      .find({ gender: new RegExp(`${value}`, "i") })
      .sort(sort);
    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_author_by_lengu = async (
  res: Response,
  value: string,
  sort?: object
): Promise<Author[]> => {
  try {
    const coincidences: Author[] = await author
      .find({ language: new RegExp(`${value}`, "i") })
      .sort(sort);
    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_author_by_reg_date = async (
  res: Response,
  from: string,
  sort?: object
): Promise<Author[]> => {
  try {
    const to = from
        .substring(0, 8)
        .concat((parseInt(from.substring(8)) + 1).toString()),
      coincidences: Author[] = await author
        .find({
          $and: [
            { registration_date: { $gte: new Date(from) } },
            { registration_date: { $lt: new Date(to) } },
          ],
        })
        .sort(sort);
    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_author_filter = async (
  res: Response,
  filter: object
): Promise<Author[]> => {
  try {
    const coincidences: Author[] = await author.find(filter);
    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err; 
  }
};
