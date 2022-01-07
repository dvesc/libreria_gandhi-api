import { Response } from "express";
import { send_error } from "../utils/response_utils";
import { book_model, Book } from "../schemas/books_schemas";
import * as author_services from "./author_services";
import * as publisher_services from "./publisher_services";

const book = book_model;

export const create_book = async (
  res: Response,
  model: object
): Promise<void> => {
  try {
    book.create(model);
  } catch (err) {
    send_error(res, err);
  }
};
//-----------------------------------------------------------------------------
export const get_book_filter = async (
  res: Response,
  filter: object
): Promise<Book[]> => {
  try {
    const coincidences: Book[] = await book
      .find(filter)
      .populate({
        path: "author",
        select: { name: 1 },
      })
      .populate({
        path: "publisher",
        select: { name: 1 },
      });
    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_books_by_name = async (
  res: Response,
  value: string,
  sort?: object
): Promise<Book[]> => {
  try {
    let filter: object = {};
    if (value) filter = { name: new RegExp(`${value}`, "i") };

    const coincidences: Book[] = await book
      .find(filter)
      .sort(sort)
      .populate({
        path: "author",
        select: { name: 1 },
      })
      .populate({
        path: "publisher",
        select: { name: 1 },
      });

    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_book_by_id = async (
  res: Response,
  value: string,
): Promise<Book | null> => {
  try {
    return book.findById(value)
  }catch(err){
    send_error(res,err)
    throw err;
  }
}
//-----------------------------------------------------------------------------
export const get_books_by_author = async (
  res: Response,
  value: string,
  sort?: object
): Promise<Book[]> => {
  try {
    let val = "";
    if (value) val = value;

    const authors = await author_services.get_author_by_name(res, val),
      terms: object[] = [];
    authors.forEach((author) => terms.push({ author: author._id }));

    let filter: object = { __v: -1 }; //es para que no salga ninguno si no hay coincidencia de authores

    if (terms.length > 0) filter = { $or: terms };
    const coincidences: Book[] = await book
      .find(filter)
      .sort(sort)
      .populate({
        path: "author",
        select: { name: 1, _id: 0 },
      })
      .populate({
        path: "publisher",
        select: { name: 1, _id: 0 },
      });

    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_books_by_publisher = async (
  res: Response,
  value: string,
  sort?: object
): Promise<Book[]> => {
  try {
    let val = "";
    if (value) val = value;

    const publishers = await publisher_services.get_publisher_by_name(res, val),
      terms: object[] = [];
    publishers.forEach((publisher) => terms.push({ publisher: publisher._id }));

    let filter: object = { __v: -1 };
    if (terms.length > 0) filter = { $or: terms };

    const coincidences: Book[] = await book
      .find(filter)
      .sort(sort)
      .populate({
        path: "author",
        select: { name: 1 },
      })
      .populate({
        path: "publisher",
        select: { name: 1 },
      });

    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_books_by_format = async (
  res: Response,
  value: string,
  sort?: object
): Promise<Book[]> => {
  try {
    let filter: object = {};
    if (value) filter = { format: value };
    const coincidences: Book[] = await book
      .find(filter)
      .sort(sort)
      .populate({
        path: "author",
        select: { name: 1 },
      })
      .populate({
        path: "publisher",
        select: { name: 1 },
      });

    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_books_by_language = async (
  res: Response,
  value: string,
  sort?: object
): Promise<Book[]> => {
  try {
    let filter: object = {};
    if (value) filter = { language: value };
    const coincidences: Book[] = await book
      .find(filter)
      .sort(sort)
      .populate({
        path: "author",
        select: { name: 1 },
      })
      .populate({
        path: "publisher",
        select: { name: 1 },
      });

    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_books_by_year = async (
  res: Response,
  value: string,
  sort?: object
): Promise<Book[]> => {
  try {
    let filter: object = {};
    if (value) filter = { year: parseInt(value) };
    const coincidences: Book[] = await book
      .find(filter)
      .sort(sort)
      .populate({
        path: "author",
        select: { name: 1 },
      })
      .populate({
        path: "publisher",
        select: { name: 1 },
      });

    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_books_by_all = async (
  res: Response,
  value: string,
  sort?: object
): Promise<Book[]> => {
  try {
    let val = "";
    if (value) val = value;

    const reg_exp = new RegExp(`${val}`, "i"),
      terms: object[] = [
        { name: reg_exp },
        { format: reg_exp },
        { language: reg_exp },
        { publication_year: reg_exp },
      ],
      publishers = await publisher_services.get_publisher_by_name(res, value),
      authors = await author_services.get_author_by_name(res, value);

    publishers.forEach((publisher) => terms.push({ publisher: publisher._id }));
    authors.forEach((author) => terms.push({ author: author._id }));
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    let filter: object = { __v: -1 };
    if (terms.length > 0) filter = { $or: terms };
    const coincidences: Book[] = await book
      .find(filter)
      .sort(sort)
      .populate({
        path: "author",
        select: { name: 1 },
      })
      .populate({
        path: "publisher",
        select: { name: 1 },
      });

    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
