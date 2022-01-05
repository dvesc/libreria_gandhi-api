import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { send_error } from "../utils/response_utils";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express{ //le agregamos una funcionalidad personalizada a express
    export interface Request { //exporamos un nuevo Request con un nuevo parametro
      login: {
        account_id: string;
      }
    }
  }
}

export const newpass_middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const process_token: string =  req.query.process_id as string;

    if (!process_token) throw new Error("missing param process_id")
    
    const payload = jwt.verify(
      process_token,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.TOKEN_PASSWORD!
    );

    /*le pasamos al req el process_token en limpio con el id
      sobreescribimos el req agregando un nuevo parametro "autorization"
    */
    req.login = {
      account_id: payload as string
    }

    next();
  } catch (err) {
    send_error(res, err);
  }
};
