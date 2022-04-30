import { Body, ClassSerializerInterceptor, Controller, Delete, Get, ParseIntPipe, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetUser } from 'src/shared/decorator';
import { JwtGuard } from 'src/shared/guard';
import { AddPhoneDto, EditProfileDto } from './dto';
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
  getUserAddress(@GetUser('id') id: number) {
    return this.userService.getUserAddress(id);
  }

  //unimplemented yet
  @Post('address')
  setAddress() {
    this.userService.setAddress();
  }

  //unimplemented yet
  @Delete('address/:id')
  deleteAddress() {
    this.userService.deleteAddress();
  }
}
