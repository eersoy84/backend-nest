import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { REGEX, MESSAGES } from 'src/app.utlis';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(2)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  // @Matches(REGEX.PASSWORD_RULE, {
  //   message: MESSAGES.PASSWORD_RULE_MESSAGE,
  // })
  password: string;

  @IsString()
  csrfToken: string;

  @IsString()
  callbackUrl: string;

  @IsBoolean()
  redirect: boolean;

  @IsBoolean()
  json: boolean;
}
