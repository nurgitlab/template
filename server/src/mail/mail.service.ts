import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MailService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async sendConfirmMail(email: string, confirmToken: string): Promise<void> {
    const confirmUrl = `${process.env.URL}/auth/confirm/email?token=${confirmToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Medcard App! Confirm your Email!',
      template: './confirmation',
      context: {
        name: 'user',
        url: confirmUrl,
      },
    });
  }

  async sendUserConfirmation(
    user: {
      name: string;
      email: string;
    },
    token: string,
  ) {
    const url = `${process.env.URL}/auth/confirm?token=${token}`;

    console.log(user);
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Medcard App! Confirm your Email!',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });
  }
}
