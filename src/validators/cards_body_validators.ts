import { checkSchema, ParamSchema } from "express-validator";

const integer_schema = (): ParamSchema => {
  return {
    isString: {
      negated: true,
      bail: true,
      errorMessage: "Must be an Integer",
    },
    isInt: true,
    optional:{
      options:{
        nullable: true
      }
    }
  }
}

const text_schema = ():ParamSchema =>{
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
    optional:{
      options:{
        nullable: true
      }
     } 
  }
}

const date_string_schema = ():ParamSchema =>{
  return {
    //OJOOO MATCHES ES LITERALMENTE UN IF :D
    matches: {
      // eslint-disable-next-line no-useless-escape
      options: /^(0?[1-9]|1[012])[\/]\d{4}$/
    },  
    errorMessage: "Must be in valid format: 'mm/yyyy'",
    optional:{
      options:{
        nullable: true
      }
    }
  }
}

//-----------------------------------------------------------------------------
export const cards_body_validator = checkSchema({
  number: integer_schema(),
  titular_name: text_schema(),
  expiration_date: date_string_schema(),
  security_code: integer_schema()
});