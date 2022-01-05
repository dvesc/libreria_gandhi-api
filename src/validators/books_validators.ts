import { checkSchema, ParamSchema } from "express-validator";

const text_schema = (): ParamSchema => {
  return {
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
    }
  }
}

const name_schema = (): ParamSchema => {
  return {
    isString: true,
    isAscii: {
      bail: true,
      errorMessage: "Cannot contain rare characters",
    },
    customSanitizer: {
      options: (value: string): string => 
        value.toLowerCase()
    }
  }
}

const integer_schema = (): ParamSchema => {
  return {
    isString: {
      negated: true,
      bail: true,
      errorMessage: "Must be an Integer",
    },
    isInt:true,
  }
}

const id_schema = (): ParamSchema => {
  return {
    matches:{
      options: /^[0-9a-fA-F]{24}$/
    },
    errorMessage: "Must be a valid mongo id"
  }
}


export const book_validator = checkSchema({
  name: name_schema(),
  publisher: id_schema(),
  pages: integer_schema(),
  format: text_schema(),
  language: text_schema(),
  publication_year: integer_schema(),
  author: id_schema()
});


/**
  const array_schema = (): ParamSchema =>{
    return {
      isArray: {
        bail: true,
        errorMessage: "Must be an Array"
      },
      custom: {
        options: (value:any): boolean=>{          
          if (value.length === 0) return false;
          return true
        }
      },
      errorMessage:"'books' must contain at least one book"
    }
  }


  export const book_validator = checkSchema({
    books: array_schema(),
    "books.*.name": name_schema(),
    "books.*.publisher": text_schema(),
    "books.*.pages": integer_schema(),
    "books.*.format": text_schema(),
    "books.*.lenguage": text_schema(),
    "books.*.publication_year": integer_schema(),
    "books.*.author": text_schema()
} ); 

----------------------------------------------------
{
    "books": [
        {
            "name": "Guerra mundial Z",
            "publisher": "Planeta",
            "pages": 234,
            "format": "tapa blanda",
            "lenguage": "Spanish",
            "publication_year": 2014,
            "author": "Max Brooks"
        },
        {
            "name": "Guerra mundial Z",
            "publisher": "Planeta",
            "pages": 234,
            "format": "tapa blanda",
            "lenguage": "Spanish",
            "publication_year": 2014,
            "author": "Max Brooks"
        }
    ]
}
*/