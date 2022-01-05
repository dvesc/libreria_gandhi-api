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

const email_schema = (): ParamSchema => {
  return {
    isEmail: {
      bail: true,
      errorMessage: "'email' must be a valid email format",
    },
    customSanitizer: {
      options: (value: string): string => {
        return value.toLowerCase();
      },
    },
  };
};

const password_schema = (): ParamSchema => {
  return {
    isStrongPassword: {
      options: { 
        minLength: 8,
        minLowercase: 1, 
        minUppercase: 1, 
        minNumbers: 1, 
        minSymbols: 1, 
        returnScore: false,
      },
      errorMessage:
        "It must be at least 8 characters long:1 in uppercase,1 number,1 punctuation mark,1 special character",
    },
  };
};
const phone_schema = (): ParamSchema =>{
  return { 
    contains: {
      errorMessage:"necessary value"
    } 
  }
}
const number_schema = (): ParamSchema => {
  return {
    customSanitizer: {
      //int o string lo se convierte en stringsi o si
      options: (value: string | number): string => {
        if (typeof value === "number") {
          return value.toString();
        }
        return value as string;
      },
    },
    isMobilePhone: {
      options: ["any", { strictMode: false }],
      errorMessage: "must be a valid phone number",
    },
  };
};

const country_schema = (): ParamSchema => {
  return {
    isInt: {
      negated: true,
      bail: true,
      errorMessage: "Must be a string",
    },
    isString: true,
    isAlpha: {
      options: ["es-ES"],
      bail: true,
      errorMessage: "Cannot contain numbers or special chars",
    },
    customSanitizer: {
      options: (value: string): string => {
        return value.toLowerCase();
      },
    },
  };
};
//-----------------------------------------------------------------------------
export const create_validator = checkSchema({
  first_name: name_schema(),
  last_name: name_schema(),
  email: email_schema(),
  password: password_schema(),
  phone: phone_schema(),
  "phone.number": number_schema(),
  "phone.country": country_schema(),
});

export const login_validator = checkSchema({
  email: email_schema(),
  password: password_schema(),
});

export const forgot_validator = checkSchema({
  email: email_schema(),
})

export const password_validator = checkSchema({
  password: password_schema(),
})