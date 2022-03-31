import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class EditProfileDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
