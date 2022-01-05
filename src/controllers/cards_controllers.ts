/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Response, Request } from "express";
import { account_model } from "../schemas/accounts_schemas";
import { send_error, apiError } from "../utils/response_utils";
import * as valid from "card-validator";
import { cards_request } from "../utils/process_req";
import { paginated_data } from "../utils/pagination";

const account = account_model;

//-----------------------------------------------------------------------------
export const create_card = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { expiration_date } = req.body;
    const account_id = req.account.id,
      { number, titular_name, security_code } = req.body,
      { month, year } = valid.expirationDate(expiration_date),
      existing_account = await account.findOne({ _id: account_id });

    if (!existing_account)
      throw new apiError(
        "Account does not exist",
        account_id
      );

    expiration_date = new Date(parseInt(year!), parseInt(month!), 0);

    existing_account.cards!.push({
      number,
      security_code,
      expiration_date,
      titular_name,
    });

    await existing_account.save();

    res.send({ msg: "Card created successfully" });
  } catch (err) {
    send_error(res, err);
  }
};

//-----------------------------------------------------------------------------
export const get_cards = async (
  req: Request, 
  res: Response
): Promise<void> => {
  try {
    const account_id: string = req.account.id,
      page = parseInt(req.query.page as string) || 1,
      size = parseInt(req.query.size as string) || 3,
      existing_account = await account
        .findOne({ _id: account_id })
        .select({ cards: 1, _id: 0 });

    if (!existing_account)
      throw new apiError(
        "Account does not exist",
        account_id
      );

    const valid_cards = existing_account!.cards!.filter(
      (obj) => obj.discharge_date === null
    );

    res.send(paginated_data(page,size,valid_cards,req));
  } catch (err) {
    send_error(res, err);
  }
};

//-----------------------------------------------------------------------------
export const edit_cards = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const req_validated = await cards_request(req);
    if (req_validated instanceof Error) throw req_validated;

    const { existing_account, index_card } = req_validated,
      { number, titular_name, security_code } = req.body,
      data = existing_account!.cards![index_card!];
    let { expiration_date } = req.body
    
      
    if(expiration_date) {
      const { month, year } = valid.expirationDate(expiration_date)
      expiration_date = new Date(parseInt(year!), parseInt(month!), 0);
    }

    existing_account!.cards![index_card!].number =
      number || data.number;
    existing_account!.cards![index_card!].titular_name =
      titular_name || data.titular_name;
    existing_account!.cards![index_card!].expiration_date =
      expiration_date || data.expiration_date;
    existing_account!.cards![index_card!].security_code =
      security_code || data.security_code;

    existing_account.save();

    res.send({ status: "cards edited successfully" });
  } catch (err) {
    send_error(res, err);
  }
};

//-----------------------------------------------------------------------------
export const delete_card = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const req_validated = await cards_request(req);
    if (req_validated instanceof Error) throw req_validated;

    const { existing_account, index_card } = req_validated;
    existing_account!.cards![index_card!].discharge_date = Date();
    existing_account.save();
    res.send({ status: "Card removed successfully" });
  } catch (err) {
    send_error(res, err);
  }
};
