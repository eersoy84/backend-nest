import { Body, ClassSerializerInterceptor, Controller, Get, ParseIntPipe, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetUser } from 'src/shared/decorator';
import { JwtGuard } from 'src/shared/guard';
import { AnswerQuestionDto, AnswersDto, PermissionDto } from './dto';

import { SellerService } from './seller.service';

@Controller('seller')
export class SellerController {
  constructor(private sellerService: SellerService) {}

  @Get('list')
  @UseGuards(JwtGuard)
  getSellers(@GetUser('id', ParseIntPipe) userId: number) {
    console.log('burada');
    return this.sellerService.getSellers(userId);
  }

  //   @Get('list/:id')
  //   @UseGuards(JwtGuard)
  //   getSellerById() {
  //       this.sellerService.getSellers()
  //   }

  @Post('ads')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  getAds(@GetUser('id', ParseIntPipe) userId: number, @Body() dto: PermissionDto) {
    return this.sellerService.getAds(userId, dto);
  }

  @Post('answerQuestion')
  @UseGuards(JwtGuard)
  answerQuestion(@Body() dto: AnswersDto) {
    return this.sellerService.answerQuestion(dto);
  }

  @Post('createSubMerchant')
  createSubMerchant(@GetUser('id', ParseIntPipe) userId: number) {
    return this.sellerService.createSubMerchant(userId);
  }

  @Post('updateSubMerchant')
  updateSubMerchant(@GetUser('id', ParseIntPipe) userId: number) {
    return this.sellerService.updateSubMerchant(userId);
  }
}
