import nodemailer from 'nodemailer';
import config from '../config';
import { APIError } from './error';
export const sendMail = async (
  email: string,
  subject: string,
  body: string
) => {
  try {
    const transport = nodemailer.createTransport({
      port: Number(config.MAILER.PORT),
      host: config.MAILER.HOST,
      service: config.MAILER.SERVICE,
      secure: Boolean(config.MAILER.SECURE),
      auth: {
        user: config.MAILER.GMAIL_USER,
        pass: config.MAILER.GMAIL_PASSWORD,
      },
    });
    console.log('sending to ', email);
    await transport.sendMail({
      from: config.MAILER.GMAIL_USER,
      to: email,
      subject,
      text: body,
    });
  } catch (error) {
    console.log(error);
    throw new APIError('Failed to send email');
  }
};
