import { Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/send-mail')
  async sendEmail() {
    const dto: SendEmailDto = {
      from: {
        name: 'Lucy',
        address: 'lucy@me.com',
      },
      to: [
        {
          name: 'Jhone',
          address: 'jhone@me.com',
        },
        {
          name: 'kiruththigan',
          address: 'kiru1997kiruthi@gmail.com',
        },
      ],
      subject: 'Hello welcome to mail service',
      html: '<h1>Hello World</h1>',
    };
    return this.mailerService.sendEmail(dto);
  }
}
