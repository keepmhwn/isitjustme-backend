import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async requestVerificationMail(email: string) {
    const token = this.generateRandomNumber();
    await this.cacheManager.set(email, token);
    await this.emailService.sendVerficationMail(email, token);
  }

  async verifyEmail(email: string, token: string) {
    const numToken = Number(token);

    if (Number.isNaN(numToken)) {
      throw new BadRequestException('인증번호가 숫자로 구성되어있지 않습니다.');
    }

    const cachedToken = await this.cacheManager.get(email);

    if (cachedToken === undefined) {
      throw new NotFoundException('이메일 인증의 유효시간이 초과되었습니다.');
    }

    if (cachedToken !== numToken) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    }

    await this.cacheManager.del(email);
  }

  private generateRandomNumber(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
