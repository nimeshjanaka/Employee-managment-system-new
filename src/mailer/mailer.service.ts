import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class MailerService {
  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    return transporter;
  }

  async sendEmail(dto: SendEmailDto) {
    const { from, to, subject, text, html, placeholderReplacements } = dto;

    const transporter = this.mailTransport();

    const options: Mail.Options = {
      from: from ?? {
        name: process.env.APP_NAME,
        address: process.env.MAIL_SENDER,
      },
      to,
      subject,
      // text,
      html,
    };

    try {
      const result = await transporter.sendMail(options);
      return result;
    } catch (error) {
      console.log('ERROR while sending email', error);
    }
  }
}
