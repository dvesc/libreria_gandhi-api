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
  pag: number,
  siz: number,
  data_array: Array<any>,
  req: Request
): any => {
  const page = pag || 1,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    size = siz || parseInt(process.env.SIZE_DEFAULT!),
    start = (page - 1) * size,
    estimated_pages = data_array.length / size;
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  let total_pages: number;
  if (estimated_pages > 0 && estimated_pages < 1)
    total_pages = Math.ceil(estimated_pages);
  else total_pages = Math.floor(estimated_pages);
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  let url = req.url.replace(/^(\/([a-z]{1,})?(\?))/, "?"),
    complete_url = "",
    params: string[] = url.split("&"),
    links: object = {};
  if (!params.some((element) => /page=\d{1,}/g.test(element))) {
    if (url.includes("?")) url = url.concat("&page=1");
    else url = url.concat("?page=1");
    params = url.split("&");
  }
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
