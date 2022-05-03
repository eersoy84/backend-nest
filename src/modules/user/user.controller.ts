import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetUser } from 'src/shared/decorator';
import { JwtGuard } from 'src/shared/guard';
import { AddPhoneDto, AddressDto, EditProfileDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('addPhone')
  addPhone(@GetUser('id') id: number, @Body() dto: AddPhoneDto) {
    return this.userService.addPhone(id, dto);
  }

  @Post('editProfile')
  editProfile(@GetUser('id') id: number, @Body() dto: EditProfileDto) {
    return this.userService.editProfile(id, dto);
  }

  @Get('address')
  getUserAddress(@GetUser('id') userId: number) {
    return this.userService.getUserAddress(userId);
  }

  @Post('address')
  setAddress(@GetUser('id', ParseIntPipe) userId: number, @Body() dto: AddressDto) {
    return this.userService.setAddress(userId, dto);
  }

  @Delete('address/:id')
  deleteAddress(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteAddress(id);
  }
}
