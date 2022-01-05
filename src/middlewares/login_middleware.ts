import { Response, Request, NextFunction } from "express";
import { apiError, send_error } from "../utils/response_utils";
import jwt  from "jsonwebtoken";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express{ //le agregamos una funcionalidad personalizada a express
    export interface Request { //exporamos un nuevo Request con un nuevo parametro
        account:{
          id: string;
        }  
      }
    }
  }
  
export const login_middleware = (req: Request,res: Response,next: NextFunction) => {
  try{
    const auth: string = req.headers.authorization as string;

    if (!auth) 
    throw new apiError(
      "missing header autorizate",
      auth,
    );

    const login_token = auth.slice(7,auth?.length)
       
    const { account_id } = jwt.verify(
      login_token,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.TOKEN_PASSWORD!
    ) as any //para que funcione la destructuracion
   
    req.account = {id: account_id} //para que funcione

    next();
  } catch(err){
    send_error(res,err)
  }
  
};