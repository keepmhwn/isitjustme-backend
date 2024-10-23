import {
  Controller,
  ValidationPipe,
  Post,
  Put,
  Body,
  Query,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/verify/email')
  async requestVerificationMail(
    @Body(ValidationPipe) verifyEmailDto: VerifyEmailDto,
  ) {
    const { email } = verifyEmailDto;
    return this.authService.requestVerificationMail(email);
  }

  @Put('/verify/email')
  async verifyEmail(
    @Body(ValidationPipe) verifyEmailDto: VerifyEmailDto,
    @Query() query,
  ) {
    const { email } = verifyEmailDto;
    const { token } = query;
    return this.authService.verifyEmail(email, token);
  }
}
