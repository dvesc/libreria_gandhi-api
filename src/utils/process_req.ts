import { Request } from "express";

import { account_model } from "../schemas/accounts_schemas";
import { apiError } from "./response_utils";

const account = account_model;

export const address_request = async (req: Request): Promise<any | Error> => {
  try {
    const account_id = req.account.id,
      object_id = req.params.address_id,
      existing_account = await account.findOne({ _id: account_id });

  
    if (!existing_account) 
      throw new apiError(
        "Account does not exist",
        account_id,
      );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const index = existing_account.addresses!.findIndex(
      (obj) => obj._id.toString() == object_id
    )

    if (
      index === -1 ||
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      existing_account.addresses![index].discharge_date
    )
      throw new apiError(
        "Does not exist or does not belong to this account",
        object_id,
        "Params"
      );

    return {
      existing_account,
      index_address: index,
    };
  } catch (err) {
    return err as Error;
  }
};

//-----------------------------------------------------------------------------
export const cards_request = async (req: Request): Promise<any | Error> => {
  try {
    const account_id = req.account.id,
      object_id = req.params.card_id,
      existing_account = await account.findOne({ _id: account_id });
  
    if (!existing_account)
      throw new apiError(
        "Account does not exist",
        account_id,
      );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const index = existing_account.cards!.findIndex(
      (obj) => obj._id.toString() == object_id
    );

    if (
      index === -1 ||
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      existing_account.cards![index].discharge_date
    )
      throw new apiError(
        "Does not exist or does not belong to this account",
        object_id,
        "Params"
      );

    return {
      existing_account,
      index_card: index,
    };
  } catch (err) {
    return err as Error;
  }
};
