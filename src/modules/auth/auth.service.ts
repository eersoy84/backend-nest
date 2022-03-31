import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import {
  users,
  Prisma,
  users_role,
} from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  LoginDto,
  RegisterDto,
  UserDto,
} from './dto';
import * as bcrypt from 'bcrypt';

@Injectable({})
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    loginDto: LoginDto,
  ): Promise<UserDto | undefined> {
    const { email, password } = loginDto;
    const user =
      await this.loginUserWithEmailPassword(
        email,
        password,
      );
    return new UserDto(user);
  }

  async register(
    dto: RegisterDto,
    createdIp: string,
  ): Promise<UserDto | undefined> {
    const oldUser = await this.checkUserEmail(
      dto.email,
    );
    if (oldUser) {
      throw new HttpException(
        'Bu e-posta hesabı başka bir kullanıcıya aittir',
        HttpStatus.FORBIDDEN,
      );
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(
      dto.password,
      salt,
    );
    const user = await this.prisma.users.create({
      data: {
        email: dto.email,
        password: hash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        createdIp: createdIp || '120.123.12.12',
      },
    });
    return new UserDto(user);
  }

  private async loginUserWithEmailPassword(
    email: string,
    password: string,
  ): Promise<users | undefined> {
    const user = await this.checkUserEmail(email);
    if (!user) {
      throw new HttpException(
        'Kullanıcı adınız hatalı!',
        HttpStatus.FORBIDDEN,
      );
    }
    const isPasswordSame =
      await this.checkUserPassword(
        password,
        user.password,
      );

    if (!isPasswordSame) {
      throw new HttpException(
        'Şifreniz hatalı!',
        HttpStatus.FORBIDDEN,
      );
    }
    return user;
  }

  private async checkUserEmail(
    email: string,
  ): Promise<users | undefined> {
    return await this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  private async checkUserPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean | undefined> {
    return await bcrypt.compare(
      password,
      hashedPassword,
    );
  }
}
