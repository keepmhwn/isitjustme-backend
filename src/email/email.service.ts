import { Injectable } from '@nestjs/common';

import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private transporter: Mail;
  constructor() {
    this.transporter = createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS_KEY,
      },
    });
  }

  async sendVerficationMail(email: string, token: number) {
    const mailOptions = {
      to: email,
      subject: 'isitjustme 회원가입을 위한 인증 메일입니다.',
      html: `<div>
        <h1>isitjustme</h1>
        <br/>
        <p>회원가입을 위해 아래 인증번호로 인증을 진행해 주세요.</p>
        <p style="font-weight:500; font-size: 18px;">${token}<p>
        <br/>
        <br/>
        <p style="color: #888;">본 메일은 발신 전용입니다.</p>
      </div>
      `,
    };

    this.transporter.sendMail(mailOptions);
  }
}
