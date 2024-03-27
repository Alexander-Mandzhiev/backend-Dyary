import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDTO } from './dto/mail.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) { }

  @Post()
  async sendEmail(@Body() dto: SendEmailDTO) {
    return await this.mailerService.sendEmail(dto)
  }
}
