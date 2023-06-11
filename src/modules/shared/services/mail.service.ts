/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(
      smtpTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      }),
    );
  }

  async sendMail(to: string, subject: string, url: string) {
    const mailOptions = {
      from: 'binhdeptrai1905@gmail.com',
      to,
      subject,
      html: `
            <div>
                <h2> Welcome to TT Blog." </h2>
                <p>
                    Congratulations! You're almost set to start with TT Blog.
                    Just click the button below to reset your acount password.
                </p>
                <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;"> 
                    ${subject} 
                </a>
                <p>
                    If the button doesn't work for any reason, you can also click on the link below:
                </p>
                <div>
                    ${url}
                </div>
            </div>
        `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
