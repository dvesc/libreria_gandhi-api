import * as nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "libreriaghandiapi@gmail.com",
    pass: "bmeolkcsvavajcch"
  }
});




