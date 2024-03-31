import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendEmailDTO } from './dto/mail.dto';
import Mail from 'nodemailer/lib/mailer';
import { map } from 'rxjs';

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
      to, subject, html: `
          <div>
            <span style="display: flex; gap: 10px; align-items: center">
              <h2>Diary</h2>
            </span>
            <hr color="#000" />
            <h3>Чтобы начать работу с Diary, перейдите по ссылке ниже:</h3>
            <a
              href="${this.configService.get<string>('CLIENT_URL')}/auth/confirm?token=${text}"
              style="
                padding: 10px 20px;
                border: 1px solid #cfcfcf;
                border-radius: 6px;
                text-decoration: none;
                background-color: #efefef;
              "
              >Подтвердить e-mail</a
            >
            <h3>
              Если вы не создавали учетную запись с Diary, можете проигнорировать это
              письмо. Возможно, другой пользователь ввёл свою информацию неправильно.
            </h3>
          </div>
      `
    }

    try {
      const result = await transport.sendMail(options)
      return result
    } catch (error) {
      throw new Error()
    }
  }
}