/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import { ConfigService } from './config.service';

@Injectable()
export class EmailService {
  async sendMail(to: string, subject: string, url: string) {
    const { rootEmail, rootEmailAppPass } = new ConfigService();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: rootEmail,
        pass: rootEmailAppPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: rootEmail,
      to,
      subject,
      html: `
            <div>
                <h2> Welcome to Media Blog." </h2>
                <p>
                    Congratulations! You're almost set to start with Media Blog.
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

    return await transporter.sendMail(mailOptions);
  }

  async sendSignupMail(to: string, subject: string, url: string) {
    const { rootEmail, rootEmailAppPass } = new ConfigService();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: rootEmail,
        pass: rootEmailAppPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: rootEmail,
      to,
      subject,
      html: `
            <div>
                <h2> Welcome to Media Blog." </h2>
                <p>
                    Congratulations! You're almost set to start with Media Blog.
                    Just click the button below to go to the Media Blog.
                </p>
                <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;"> 
                    Media Dashboard
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

    return await transporter.sendMail(mailOptions);
  }

  async sendRegisterMail(to: string, subject: string, url: string) {
    console.log({ to, subject, url });

    const { rootEmail, rootEmailAppPass } = new ConfigService();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: rootEmail,
        pass: rootEmailAppPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: rootEmail,
      to,
      subject,
      html: `
            <div>
                <h2> Welcome to Media Blog." </h2>
                <p>
                    Congratulations! You're almost set to start with Media Blog.
                    Just click the button below to go to the register of Media Blog.
                </p>
                <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;"> 
                    Media Dashboard
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
    console.log('ddddddddddd');
    return await transporter.sendMail(mailOptions);
  }
}
