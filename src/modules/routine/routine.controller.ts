import { ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, UseInterceptors } from '@nestjs/common';
import { RoutineService } from './routine.service';

@Controller('routines')
export class RoutineController {
  constructor(private routineService: RoutineService) {}

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
  getInstantAdInfo() {}

  @Get('favorites')
  getFavorites() {}

  @Post('follow')
  follow() {}

  @Post('unfollow')
  unFollow() {}
}
