import { checkSchema, ParamSchema } from "express-validator";

const name_schema = (): ParamSchema => {
  return {
    isInt: {
      negated: true,
      bail: true,
      errorMessage: "Must be a string",
    },
    isString: true,
    isAlpha: {
      options: ["es-ES", { ignore: " -." }],
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

const date_string_schema = (): ParamSchema => {
  return {
    //OJOOO MATCHES ES LITERALMENTE UN IF :D
    matches: {
      // eslint-disable-next-line no-useless-escape
      options: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    },
    errorMessage: "Must be in valid format: 'dd/mm/yyyy'",
    optional: {
      options: {
        nullable: true,
      },
    },
  };
};

const gener_schema = (): ParamSchema => {
  return {
    customSanitizer: {
      options: (value: string): string => {
        return value.toLowerCase();
      },
    },
    matches: {
      options: /^(man|woman|other)$/,
    },
    errorMessage: "Must be a valid gender: 'male','female' or 'other'",
  };
};

const text_schema = (): ParamSchema => {
  return {
    isInt: {
      negated: true,
      bail: true,
      errorMessage: "Must be a string",
    },
    isString: true,
    isAlpha: {
      options: ["es-ES", { ignore: " " }],
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


export const authors_validators = checkSchema({
  name: name_schema(),
  birthday: date_string_schema(),
  gender: gener_schema(),
  language: text_schema(),
});
