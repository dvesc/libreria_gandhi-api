/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import moment from "moment";

import { apiError, send_error } from "../utils/response_utils";
import { Publisher } from "../schemas/publishers_schemas";
import * as publisher_services from "../services/publisher_services";
import { paginated_data } from "../utils/pagination";

export const create_publisher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body,
      coincidences: Publisher[] =
        await publisher_services.get_publisher_by_name(res, name);

    if (coincidences[0])
      throw new apiError(
        `there is already one with the same data: ${coincidences[0]}`,
        req.body,
        "body"
      );

    await publisher_services.create_publisher(res, { name });

    if (!res.writableEnded)
      res
        .send({
          status: "Publisher created successfully",
        })
        .end();
  } catch (err) {
    send_error(res, err);
  }
};

//-----------------------------------------------------------------------------
export const get_publishers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { filterby, orderby, page, size } = req.query,
      filter_value = req.query.filtervalue as string,
      order: number = req.query.order != "desc" ? 1 : -1,
      sort: object = {
        [`${orderby || "registration_date"}`]: order,
      };
    let data: Publisher[] = [];

    switch (filterby) {
      case "name":
        data = await publisher_services.get_publisher_by_name(
          res,
          filter_value,
          sort
        );
        break;
      case "registration_date":
        if (moment(filter_value, "DD/MM/YYYY", true).isValid()) {
          const date: string = filter_value.split("/").reverse().join("/");
          data = await publisher_services.get_publisher_by_reg_date(
            res,
            date,
            sort
          );
        } else
          throw new apiError(
            "Must be in valid format: 'dd/mm/yyyy'",
            req.query.filtervalue,
            "params"
          );
        break;
      case undefined:
        data = await publisher_services.get_all_publishers(res, sort);
        break;
    }

    if (!res.writableEnded)
      res.send(
        paginated_data(
          parseInt(page as string) || 1,
          parseInt(size as string) || 10,
          data!,
          req
        )
      );
  } catch (err) {
    send_error(res, err);
  }
};
