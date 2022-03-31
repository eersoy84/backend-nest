import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { REGEX, MESSAGES } from 'src/app.utlis';
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  // @Matches(REGEX.PASSWORD_RULE, {
  //   message: MESSAGES.PASSWORD_RULE_MESSAGE,
  // })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  lastName: string;
}
