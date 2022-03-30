import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto';

@Injectable({})
export class TokenService {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async getToken(user: UserDto): Promise<string> {
    return await this.generateToken(
      user,
      'access_token',
    );
  }

  private async generateToken(
    user: UserDto,
    type: string,
  ): Promise<string> {
    const payload = {
      sub: user.id,
      type,
    };
    return await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
