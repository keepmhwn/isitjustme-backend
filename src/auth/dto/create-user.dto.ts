import { IsEmail, IsString, Length, Matches } from 'class-validator';

export default class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  nickName: string;

  @IsString()
  @Length(8, 20)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{1,}$/, {
    message: '비밀번호 형식이 맞지 않습니다.',
  })
  password: string;

  @IsString()
  passwordConfirm: string;
}
