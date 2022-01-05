import { checkSchema, ParamSchema } from "express-validator";

const text_schema = (): ParamSchema => {
  return {
    optional:{
      options:{
        nullable: true
      }
    },
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
  }
}

const street_schema = ():ParamSchema =>{
  return {
    optional:{
      options:{
        nullable: true
      }
    },
    isInt: {
      negated: true,
      bail: true,
      errorMessage: "Must be a string",
    },
    isString: true,
    isAlphanumeric: {
      options: ["es-ES", { ignore: " -." }]
    }
  }
}

export const address_validator = checkSchema({
  addressee: text_schema(),
  city: text_schema(),
  state: text_schema(),
  country: text_schema(),
  street: street_schema(),
});