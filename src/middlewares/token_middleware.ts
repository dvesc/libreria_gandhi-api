/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Response, Request, NextFunction } from "express";
import { apiError, send_error } from "../utils/error_handler";
import jwt  from "jsonwebtoken";

/*IMPORTANTE
  -> Lakshmi dijo que esto era genial pero que no a todos los gusta pasar el id por el token
  asi que OJO si ponen peros entonces pasar el id por la url sin mas como otro parametro
*/

/*
  como explique antes, aqui le creamos un parametro a req cuyo valor sera el id decodificado
  que obtenemos del token, no obstante puede que a algunos frontends no les guste, por lo que
  hay que tener un plan b y pasar el id por la url 
*/
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
  
export const token_middleware = (req: Request,res: Response,next: NextFunction) => {
  try{
    //Obtenemos el token desde authorization
    const auth: string = req.headers.authorization as string;
    //evaluamos si nos pasaron el token
    if (!auth) 
    throw new apiError(
      "missing header autorizate",
      auth,
    );

    //el auth contiene "Bearer <token>" por eso eliminamos los 7 primeros caracteres
    const login_token = auth.slice(7,auth?.length)

    const { account_id } = jwt.verify(
      login_token, //el token a validar
      process.env.TOKEN_PASSWORD! //necesitamos la contraseña token para verificar
    ) as any //nos retorna los datos decodificados que el token codifico, en este caso un obj
    
    //le pasamos el valor del id al parametro creado
    req.account = {id: account_id} //para que funcione
    
    //con next pasamos la validacion del token y seguimos con los controllers 
    next();
  } catch(err){
    send_error(res,err)
  }
  
};