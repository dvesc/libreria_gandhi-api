import { Response, Request } from "express";
import { Book } from "../schemas/books_schemas";
import { apiError, send_error } from "../utils/response_utils";
import { paginated_data } from "../utils/pagination";
import * as book_services from "../services/book_services";

//-----------------------------------------------------------------------------
export const create_book = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      author,
      publisher,
      pages,
      format,
      language,
      publication_year,
    } = req.body;
    
    

    if (publication_year > new Date().getFullYear() || publication_year < 0)
      throw new apiError(
        "the book still does not come out",
        publication_year,
        "params"
      );

    const coincidences: Book[] = await book_services.get_book_filter(res, {
      $and: [
        { name: name },
        { author: author },
        { publisher: publisher },
        { pages: `${pages}` },
        { format: format },
        { language: language },
        { publication_year: `${publication_year}` },
      ],
    });

    if (coincidences.length !== 0)
      throw new apiError(
        "The book already exists in the database",
        coincidences,
        "body"
      );

    await book_services.create_book(res, {
      name,
      author,
      publisher,
      pages: `${ pages }`,
      format,
      language,
      publication_year: `${publication_year}`,
    });

    res.send({ status: "created succesfully" });
  } catch (err) {
    send_error(res, err);
  }
};
//-----------------------------------------------------------------------------
export const get_books = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filterby, orderby, page, size } = req.query,
      filter_value = req.query.filtervalue as string,
      order: number = req.query.order != "desc" ? 1 : -1,
      sort: object = {
        [`${orderby || "registration_date"}`]: order,
      };
    let data: Book[] = [];

    switch (filterby) {
      case "name":
        data = await book_services.get_books_by_name(res, filter_value, sort);
        break;
      case "author":
        data = await book_services.get_books_by_author(res, filter_value, sort);
        break;
      case "publisher":
        data = await book_services.get_books_by_publisher(
          res,
          filter_value,
          sort
        );
        break;
      case "format":
        data = await book_services.get_books_by_format(res, filter_value, sort);
        break;
      case "language":
        data = await book_services.get_books_by_language(
          res,
          filter_value,
          sort
        );
        break;
      case "publication_year":
        data = await book_services.get_books_by_year(res, filter_value, sort);
        break;
      case "all":
        data = await book_services.get_books_by_all(res, filter_value, sort);
        break;
      default:
        data = await book_services.get_book_filter(res,{});
        break;
    }
    if (!res.writableEnded)
      res.send(
        paginated_data(parseInt(page as string), parseInt(size as string), data, req)
      );
  } catch (err) {
    send_error(res, err);
  }
};

export const edit_book = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { book_id } = req.params,
      {name,author, publisher,pages,format,language,publication_year} = req.body,
      data: Book | null = await book_services.get_book_by_id(res,book_id)

    if(!data)
      throw new apiError("Wrong ID or the book does not exist",book_id,"params")
    
    data.name = name || data.name
    data.author = author || data.author
    data.publisher = publisher || data.publisher
    data.pages = pages || data.pages
    data.format = format || data.format
    data.language = language || data.language
    data.publication_year =  publication_year || data.publication_year

    data.save()
    if (!res.writableEnded)
      res.send({ status: "Edited succesfully" });
  }catch(err){
    send_error(res,err)
  }
}
