/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";

import { account_model } from "../schemas/accounts_schemas";
import { paginated_data } from "../utils/pagination";
import { address_request } from "../utils/process_req";
import { send_error, apiError } from "../utils/response_utils";

const account = account_model;

export const create_address = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const account_id = req.account.id,
      { addressee, city, country, street } = req.body,
      existing_account = await account.findOne({ _id: account_id });

    if (!existing_account)
      throw new apiError(
        "Account does not exist",
        account_id
      );

    existing_account.addresses!.push({
      addressee,
      city,
      country,
      street,
    });
    await existing_account.save();

    res.send({ status: "Address created successfully" });
  } catch (err) {
    send_error(res, err);
  }
};

//-----------------------------------------------------------------------------
export const get_address = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const account_id: string = req.account.id,
      page = parseInt(req.query.page as string) || 1,
      size = parseInt(req.query.size as string) || 3,
      existing_account = await account
        .findOne({ _id: account_id })
        .select({ addresses: 1, _id: 0 })
    
    
    if (!existing_account)
      throw new apiError(
        "Account does not exist",
        account_id
      );

    const valid_addresses = existing_account!.addresses!.filter(
      (obj) => obj.discharge_date === null
    );

    res.send(paginated_data(page,size,valid_addresses,req));
  } catch (err) {
    send_error(res, err);
  }
};
//-----------------------------------------------------------------------------
export const edit_address = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const req_validated = await address_request(req);
    if (req_validated instanceof Error) throw req_validated;

    const { existing_account, index_address } = req_validated,
      { addressee, city, country, street } = req.body,
      data = existing_account!.addresses![index_address!];

    existing_account!.addresses![index_address!].addressee =
      addressee || data.addressee;
    existing_account!.addresses![index_address!].city = city || data.city;
    existing_account!.addresses![index_address!].country =
      country || data.country;
    existing_account!.addresses![index_address!].street = street || data.street;

    existing_account.save();

    res.send({ status: "Addresses edited successfully" });
  } catch (err) {
    send_error(res, err);
  }
};

//-----------------------------------------------------------------------------
export const delete_address = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const req_validated = await address_request(req);
    if (req_validated instanceof Error) throw req_validated;

    const { existing_account, index_address } = req_validated;
    existing_account!.addresses![index_address!].discharge_date = Date();
    existing_account.save();
    res.send({ status: "Address removed successfully" });
  } catch (err) {
    send_error(res, err);
  }
};
