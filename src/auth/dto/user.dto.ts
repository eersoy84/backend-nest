import { users } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserDto {
  id?: number;
  email?: string;
  image?: string;
  firstName?: string;
  lastName?: string;

  @Exclude()
  password: string;

  @Exclude()
  createdIp: string;

  @Exclude()
  emailConfirmed?: number;

  @Exclude()
  stellarId?: number;

  @Exclude()
  stellarWallet?: number;

  constructor(partial: Partial<users>) {
    Object.assign(this, partial);
  }
}
