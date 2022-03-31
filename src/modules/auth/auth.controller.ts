import {
  Controller,
  Post,
  Get,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  Ip,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
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
  register(
    @Body() registerDto: RegisterDto,
    @Ip() createdIp: string,
  ) {
    return this.authService.register(
      registerDto,
      createdIp,
    );
  }
}
