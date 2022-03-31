import { Injectable } from '@nestjs/common';
import { Prisma, users } from '@prisma/client';
import { UserDto } from 'src/modules/auth/dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  AddPhoneDto,
  EditProfileDto,
} from './dto';
// import { UserAddressDto } from './dto';

@Injectable()
export class UserService {
  constructor(public prisma: PrismaService) {}

  addPhone(id: number, dto: AddPhoneDto) {
    throw new Error('Method not implemented.');
  }

  async getUserAddress(id: number) {
    const userAddress =
      await this.prisma.userAddress.findMany({
        where: {
          userId: 129,
        },
      });
    return userAddress;
  }

  async editProfile(
    id: number,
    dto: EditProfileDto,
  ) {
    const updatedUser =
      await this.prisma.users.update({
        data: {
          ...dto,
        },
        where: {
          id: id,
        },
      });
    return new UserDto(updatedUser);
  }

  async getUsers(): Promise<users[]> {
    return await this.prisma.users.findMany();
  }

  async getUserById(id: number): Promise<users> {
    return await this.prisma.users.findUnique({
      where: {
        id: id,
      },
    });
  }
}
