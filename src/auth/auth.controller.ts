import {
  Controller,
  Post,
  Get,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto, UserDto } from './dto';
import { RegisterDto } from './dto/register.dto';
import { TokenService } from './token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.login(
      loginDto,
    );
    const token =
      await this.tokenService.getToken(user);
    console.log('token', token);
    return { user, token };
  }

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
