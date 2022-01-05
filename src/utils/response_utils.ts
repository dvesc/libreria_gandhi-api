/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any  */
import { Response } from "express";
import { mongo } from "mongoose";

export class apiError extends Error{
  value: string;
  location:string;

  constructor(message:string,value:any, location?: string){
    super(message);
    this.value = value;
    this.location = location||"Autorization";
  }
}


export const send_error = (res: Response, err: any): void => {
  let msg: string,
    value: string,
    location: string,
    status: number

  if(err instanceof mongo.MongoError){
    msg = err.message as string
    location= "Database"
    status = 500;
  } else {
    msg = err.message
    value = err.value;
    location = err.location;
    status = 400;
  }


  const obj = {
    error: {
      msg,
      value: value!,
      location
    }
  }

  if(!res.writableEnded){
    console.log(obj);
    res.status(status).send(obj);
  } 
};
