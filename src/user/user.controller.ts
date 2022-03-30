import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/decorator';
import { JwtGuard } from 'src/guard';
import {
  AddPhoneDto,
  EditProfileDto,
} from './dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('addPhone')
  addPhone(
    @GetUser('id') id: number,
    @Body() dto: AddPhoneDto,
  ) {
    return this.userService.addPhone(id, dto);
  }

  @Get('address')
  getUserAddress(@GetUser('id') id: number) {
    return this.userService.getUserAddress(id);
  }

  @Post('editProfile')
  editProfile(
    @GetUser('id') id: number,
    @Body() dto: EditProfileDto,
  ) {
    return this.userService.editProfile(id, dto);
  }
}
