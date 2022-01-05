import { Request, Response } from "express";
import moment from "moment";

import { Author } from "../schemas/authors_schemas";
import * as author_services from "../services/author_services";
import { paginated_data } from "../utils/pagination";
import { apiError, send_error } from "../utils/response_utils";

export const create_author = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, birthday, gender, language } = req.body,
      date: Date = new Date(birthday.split("/").reverse().join("/")),
      coincidences: Author[] = await author_services.get_author_filter(res, {
        $and: [
          { name: name },
          { birthday: date },
          { gender: gender },
          { language: language },
        ],
      });

    if (coincidences[0])
      throw new apiError(
        `there is already one with the same data: ${coincidences[0]}`,
        req.body,
        "body"
      );

    await author_services.create_author(res, {
      name,
      birthday: date,
      gender,
      language,
    });

    if (!res.writableEnded)
      res.send({
        status: "Author created successfully",
      });
  } catch (err) {
    send_error(res, err);
  }
};

//-----------------------------------------------------------------------------
export const get_author = async (
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
    let data: Author[] = [];

    switch (filterby) {
      case "name":
        data = await author_services.get_author_by_name(
          res,
          filter_value,
          sort
        );
        break;
      case "gender":
        data = await author_services.get_author_by_gender(
          res,
          filter_value,
          sort
        );
        break;
      case "language":
        data = await author_services.get_author_by_lengu(
          res,
          filter_value,
          sort
        );
        break;
      case "registration_date":
        if (moment(filter_value, "DD/MM/YYYY", true).isValid()) {
          const date: string = filter_value.split("/").reverse().join("/");
          data = await author_services.get_author_by_reg_date(res, date, sort);
        } else
          throw new apiError(
            "Must be in valid format: 'dd/mm/yyyy'",
            req.query.filtervalue,
            "params"
          );
        break;
      case undefined:
        data = await author_services.get_all_authors(res,sort);
        break 
    }

    if (!res.writableEnded)
      res.send(
        paginated_data(
          parseInt(page as string) || 1,
          parseInt(size as string) || 10,
          data,
          req
        )
      );
  } catch (err) {
    send_error(res, err);
  }
};
