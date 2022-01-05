/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Request } from "express";

const create_links = (
  total_pages: number,
  complete_url: string,
  param: string
): object => {
  const page_number: number = parseInt(param.split("=")[1] || "1");
  let next = "",
    last = "",
    prev = "",
    first = "";

  if (page_number > 0 && page_number < total_pages) {
    next = complete_url.replace(/page=\d{1,}/g, `page=${page_number + 1}`);
    last = complete_url.replace(/page=\d{1,}/g, `page=${total_pages}`);
  }
  if (page_number > 1) {
    prev = complete_url.replace(/page=\d{1,}/g, `page=${page_number - 1}`);
    first = complete_url.replace(/page=\d{1,}/g, `page=1`);
  }

  return {
    next: next,
    last: last,
    prev: prev,
    self: complete_url,
    first: first,
  };
};

//-----------------------------------------------------------------------------
/* eslint-disable @typescript-eslint/no-explicit-any */
export const paginated_data = (
  page: number,
  size: number,
  data_array: Array<any>,
  req: Request
): any => {
  const start = (page - 1) * size,
    total_pages = Math.floor(data_array.length / size);
  let url = req.url.replace(/^(\/([a-z]{1,})?(\?))/, "?"),
    complete_url = "",
    params: string[] = url.split("&"),
    links: object = {};

  if (!params.some((element) => /page=\d{1,}/g.test(element))) {
    if (url.includes("?")) url = url.concat("&page=1");
    else url = url.concat("?page=1");
    params = url.split("&");
  }

  for (let i = 0; i < params.length; i++) {
    if (
      (!params[i].includes("page") && i === params.length) ||
      params[i].includes("page")
    ) {
      complete_url = req.originalUrl.split("?")[0].concat(url);
      links = create_links(total_pages, complete_url, params[i]);
    }
  }

  return {
    data: data_array.slice(start, start + size),
    meta: {
      current_page: page,
      page_size: size,
      total_elements: data_array.length,
      total_pages,
      links,
    },
  };
};
