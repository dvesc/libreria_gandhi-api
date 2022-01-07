import { checkSchema, ParamSchema } from "express-validator";

const language_schema = (update_method?: boolean): ParamSchema => {
  return {
    optional: {
      options: update_method ? { nullable: true } : false,
    },
    errorMessage: "path 'language' is requerid",
    isInt: {
      negated: true,
      bail: true,
      errorMessage: "Must be a string",
    },
    isString: true,
    isAlpha: {
      options: ["es-ES", { ignore: " ñ" }],
      bail: true,
      errorMessage: "Cannot contain numbers",
    },
    customSanitizer: {
      options: (value: string): string => {
        return value.toLowerCase();
      },
    },
  };
};

const name_schema = (update_method: boolean): ParamSchema => {
  return {
    optional: {
      options: update_method ? { nullable: true } : false,
    },
    errorMessage: "path 'name' is requerid",
    isString: true,
    isAscii: {
      bail: true,
      errorMessage: "Cannot contain rare characters",
    },
    customSanitizer: {
      options: (value: string): string => value.toLowerCase(),
    },
  };
};

const pages_schema = (update_method: boolean): ParamSchema => {
  return {
    optional: {
      options: update_method ? { nullable: true } : false,
    },
    errorMessage: "path 'pages' is requerid",
    isString: {
      negated: true,
      bail: true,
      errorMessage: "Must be an Integer",
    },
    isInt: true,
  };
};

const py_schema = (update_method: boolean): ParamSchema => {
  return {
    optional: {
      options: update_method ? { nullable: true } : false,
    },
    errorMessage: "path 'publication_year' is requerid",
    isString: {
      negated: true,
      bail: true,
      errorMessage: "Must be an Integer",
    },
    isInt: true,
  };
};

const format_schema = (update_method: boolean): ParamSchema => {
  return {
    optional: {
      options: update_method ? { nullable: true } : false,
    },
    errorMessage: "path 'format' is requerid",
    matches: {
      options: /^(hardcover|softcover|ebook)$/,
      errorMessage: "Must be a valid format: hardcover, softcover  or ebook",
    },
  };
};

const author_schema = (update_method: boolean): ParamSchema => {
  return {
    optional: {
      options: update_method ? { nullable: true } : false,
    },
    errorMessage: "path 'author' is requerid",
    matches: {
      options: /^[0-9a-fA-F]{24}$/,
      errorMessage: "Must be a valid mongo id",
    },
  };
};

const publisher_schema = (update_method: boolean): ParamSchema => {
  return {
    optional: {
      options: update_method ? { nullable: true } : false,
    },
    errorMessage: "path 'publisher' is requerid",
    matches: {
      options: /^[0-9a-fA-F]{24}$/,
      errorMessage: "Must be a valid mongo id",
    },
  };
};

export const book_validator = checkSchema({
  name: name_schema(false),
  publisher: publisher_schema(false),
  pages: pages_schema(false),
  format: format_schema(false),
  language: language_schema(false),
  publication_year: py_schema(false),
  author: author_schema(false),
});

export const book_update_validator = checkSchema({
  name: name_schema(true),
  publisher: publisher_schema(true),
  pages: pages_schema(true),
  format: format_schema(true),
  language: language_schema(true),
  publication_year: py_schema(true),
  author: author_schema(true),
});