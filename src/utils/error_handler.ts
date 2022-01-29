/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any  */
import { Response } from "express";
import { mongo } from "mongoose";

//Creamos un error personalizado 
export class apiError extends Error{
  value: string;
  location:string;

  constructor(message:string,value:any, location?: string){
    super(message);
    this.value = value;
    this.location = location||"Autorization";
  }
}

//FUNCION MANEJADORA DEL ERROR-------------------------------------------------
export const send_error = (res: Response, err: any): void => {
  let msg: string,
    value: string,
    location: string,
    status: number

  //si es un error de la base de datos
  if(err instanceof mongo.MongoError){
    msg = err.message as string
    location= "Database"
    status = 500;
  } else { //Si no
    msg = err.message
    value = err.value;
    location = err.location;
    status = 400;
  }

  //nuestro objeto de error que podremos enviarle al cliente y/o imprimir 
  const obj = {
    error: {
      msg,
      value: value!,
      location
    }
  }

  /*no podremos enviar una respuesta al cliente si ya le enviamos una, esto nos permite evaluar
    si ya han enviado algo (TRUE = ya enviaron; FALSE= aun no han enviado algo)
    OJO-> EN TODOS LOS SEND USAR ESTA VALIDACION
    */
  if(!res.writableEnded){
    console.log(obj);
    res.status(status).send(obj);
  } 
};
