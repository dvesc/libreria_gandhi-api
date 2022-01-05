import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { phone } from "phone";

import { account_model } from "../schemas/accounts_schemas";
import { send_error, apiError } from "../utils/response_utils";
import { transporter } from "../utils/mailer";


const account = account_model;

//-----------------------------------------------------------------------------
export const create_account = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { first_name, last_name, email, password } = req.body,
      { number, country } = req.body.phone,
      formatted_phone =  phone(number, { country }),
      salt = bcrypt.genSaltSync(10),
      pass_hash = bcrypt.hashSync(password, salt);

    if (!formatted_phone.isValid)
      throw new Error(
        "InvalidFormatError: the number does not match the format of the indicated country"
      );
    
    await account.create({
      first_name,
      last_name,
      email,
      phone: {
        number: number,
        country: formatted_phone.countryIso2,
        calling_code: formatted_phone.countryCode
      },
      password: pass_hash,
      registration_date: Date.now(),
    });

    res.send({ status: "Account created successfully" });
  } catch (e) {
    send_error(res, e);
  }
};

//-----------------------------------------------------------------------------
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const existing_account = await account.findOne({ email: email as string });
    const expiresIn = "1h";

    if (!existing_account)
      throw new apiError(
        "Email or account does not exist",
        email,
        "Body"
      );

    const approved: boolean = bcrypt.compareSync(
      password,
      existing_account.password
    );

    if (!approved) throw new apiError(
      "Password is incorret",
      "**********",
      "body"
    );


    const token = jwt.sign(
      { account_id: existing_account._id },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.TOKEN_PASSWORD!,
      { expiresIn }
    );

    res.send({ status: "successfully entered", token, expiresIn });
  } catch (e) {
    send_error(res, e);
  }
};

//-----------------------------------------------------------------------------
export const forgot_password = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    const existing_account = await account.findOne({ email: email});

    if (!existing_account)
      throw new apiError(
        "Email or account does not exist",
        email,
        "body"
      );

    transporter.sendMail({
      from: '"Forgot Password" <dominicode.xyz@gmail.com>', //ojo es... bueno ni yo entendi pero ojo
      to: email,
      subject: "Forgot Password",
      html:`
        <b>Please click on the following link:</b>
        <a href="${process.env.RESTORE_PASSWORD_URL}=${existing_account._id}">
          Restore new password
        </a>`
    })

    res.send({ status: "Email sent successfully" });
  } catch (e) {
    send_error(res, e);
  }
};

//-----------------------------------------------------------------------------
export const create_password = async (
  req: Request,
  res: Response
): Promise<void> => {
   try {
    const existing_account = await account.findById(req.query.process_id),
      salt = bcrypt.genSaltSync(10),
      pass_hash = bcrypt.hashSync(req.body.password, salt);
     

    if(existing_account){
      existing_account.password = pass_hash
      await existing_account.save();
      res.send({status: "the password was restared successfully"})
    }
   
  } catch (err) {
    send_error(res,err)
  }
};
