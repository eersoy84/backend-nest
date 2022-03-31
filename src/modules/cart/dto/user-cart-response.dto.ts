import { Exclude } from 'class-transformer';

export class UserCartResponseDto {
  @Exclude()
  id: string;
}
