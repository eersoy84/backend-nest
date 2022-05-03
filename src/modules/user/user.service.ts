import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, users } from '@prisma/client';
import { UserDto } from 'src/modules/auth/dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AddPhoneDto, AddressDto, EditProfileDto } from './dto';

@Injectable()
export class UserService {
  constructor(public prisma: PrismaService) {}

  addPhone(id: number, dto: AddPhoneDto) {
    throw new Error('Method not implemented.');
  }

  async getUserAddress(userId: number) {
    const userAddress = await this.prisma.userAddress.findMany({
      where: {
        userId,
      },
    });
    return userAddress;
  }

  async deleteAddress(id: number) {
    try {
      const result = await this.prisma.$queryRaw(
        Prisma.sql`CALL 
        exposed_delete_address(${id})`
      );
      if (!result) return;
      return { id: result[0].f0 };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2010') {
          throw new HttpException('Böyle bir adres bulunmamaktadır!', HttpStatus.BAD_REQUEST);
        }
      }
    }
  }

  async setAddress(userId: number, dto: AddressDto) {
    try {
      const result = await this.prisma.$queryRaw(
        Prisma.sql`CALL exposed_set_address(${userId},
          ${dto.id},${dto.city},${dto.district},${dto.addressText},${dto.phone},${dto.town}, ${dto.country}, ${dto.firstName}, ${dto.lastName},  ${dto.isCorporate}, ${dto.default},${dto.addressTitle},${dto.companyName}, ${dto.taxNumber}, ${dto.taxOffice})`
      );
      if (!result) return;
      return { id: result[0].f0 };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2010') {
          throw new HttpException('Böyle bir adres bulunmamaktadır!', HttpStatus.BAD_REQUEST);
        }
      }
    }
  }

  async editProfile(id: number, dto: EditProfileDto) {
    const updatedUser = await this.prisma.users.update({
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
