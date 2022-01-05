import { Response } from "express";
import { Publisher, publisher_model } from "../schemas/publishers_schemas";
import { send_error } from "../utils/response_utils";

const publisher = publisher_model;

export const create_publisher = async (
  res: Response,
  model: object
): Promise<void> => {
  try {
    await publisher.create(model);
  } catch (err) {
    send_error(res, err);
  }
};
//-----------------------------------------------------------------------------
export const get_all_publishers = async (
  res: Response,
  sort?: object
): Promise<Publisher[]> => {
  try {
    const coincidences: Publisher[] = await publisher
      .find({ })
      .sort(sort);
    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_publisher_by_name = async (
  res: Response,
  value: string,
  sort?: object
): Promise<Publisher[]> => {
  try {
    const coincidences: Publisher[] = await publisher
      .find({ name: new RegExp(`${value}`, "i") })
      .sort(sort);
    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
//-----------------------------------------------------------------------------
export const get_publisher_by_reg_date = async (
  res: Response,
  from: string,
  sort?: object
): Promise<Publisher[]> => {
  try {
    const to = from
        .substring(0, 8)
        .concat((parseInt(from.substring(8)) + 1).toString()),
      coincidences: Publisher[] = await publisher
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
export const get_publisher_by_filter = async (
  res: Response,
  filter: object,
  sort?: object
): Promise<Publisher[]> => {
  try {
    const coincidences: Publisher[] = await publisher.find(filter).sort(sort);
    return coincidences;
  } catch (err) {
    send_error(res, err);
    throw err;
  }
};
