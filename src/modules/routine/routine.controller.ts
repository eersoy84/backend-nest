import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetUser } from 'src/shared/decorator';
import { JwtGuard } from 'src/shared/guard';
import { FollowDto } from './dto';
import { RoutineService } from './routine.service';

@Controller('routines')
export class RoutineController {
  constructor(private routineService: RoutineService) {}
  //https://api.bizleal.com/routines/ads

  @Get('ads')
  @UseInterceptors(ClassSerializerInterceptor)
  getAds() {
    return this.routineService.getAds();
  }

  @Get('ads/:adId')
  @UseInterceptors(ClassSerializerInterceptor)
  getAdsById(@Param('adId', ParseIntPipe) adId: number) {
    return this.routineService.getAdsById(adId);
  }

  @Get('instantadinfo')
  @UseInterceptors(ClassSerializerInterceptor)
  getInstantAdInfo() {
    return this.routineService.getInstantAdInfo();
  }

  @Get('favorites')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  getFavorites(@GetUser('id', ParseIntPipe) userId: number) {
    return this.routineService.getFavorites(userId);
  }

  @Post('follow')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  follow(@GetUser('id', ParseIntPipe) userId: number, @Body() dto: FollowDto) {
    return this.routineService.follow(userId, dto);
  }

  @Post('unfollow')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  unfollow(@GetUser('id', ParseIntPipe) userId: number, @Body() dto: FollowDto) {
    return this.routineService.unfollow(userId, dto);
  }
}
