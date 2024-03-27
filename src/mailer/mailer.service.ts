import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendEmailDTO } from './dto/mail.dto';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {

  constructor(private readonly configService: ConfigService) { }

  mailTransport() {
    let transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASWORD')
      }
    })


    return transporter
  }

  async sendEmail(dto: SendEmailDTO) {
    const { from, to, placeholderReplacements, subject, html, text } = dto;
    const transport = this.mailTransport();
    const options: Mail.Options = {
      from: from ?? {
        name: this.configService.get<string>('APP_NAME'),
        address: this.configService.get<string>('DEFAULT_MAIL_FROM'),
      },
      to, subject, html
    }

    try {
      const result = await transport.sendMail(options)
      return result
    } catch (error) {
      throw new Error()
    }
  }
}