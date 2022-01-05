import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import { apiError, send_error } from "../utils/response_utils";

export const validations_middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const get_error = validationResult(req);

    if (!get_error.isEmpty()){
      const { msg, value, location } = (get_error.array())[0];
      throw new apiError(msg,value,location)
    } 
    else next();
  } catch (err){
    send_error(res,err)
  } 
};
