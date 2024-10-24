import { IsEmail } from 'class-validator';

export default class VerifyEmailDto {
  @IsEmail()
  email: string;
}
