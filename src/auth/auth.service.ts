import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { EmailService } from 'src/email/email.service';

import CreateUserDto from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async signUp(createUserDto: CreateUserDto) {
    const {
      email,
      nickName: nickname,
      password,
      passwordConfirm,
    } = createUserDto;

    const hasEmail = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (hasEmail) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    const hasNickName = await this.userRepository.findOne({
      where: {
        nickname,
      },
    });
    if (hasNickName) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }

    if (password !== passwordConfirm) {
      throw new BadRequestException('비밀번호가 맞지 않습니다.');
    }

    const newUser = this.userRepository.create({
      email,
      nickname,
      password,
    });

    try {
      await this.userRepository.save(newUser);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  private generateRandomNumber(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
