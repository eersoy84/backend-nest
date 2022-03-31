import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorator';
import { JwtGuard } from 'src/shared/guard';
import { AskQuestionDto } from './dto';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get('questions/:adId')
  @UseInterceptors(ClassSerializerInterceptor)
  getQuestions(
    @Param('adId', ParseIntPipe) adId: number,
  ) {
    return this.itemService.getQuestions(adId);
  }

  @Get('reviews/:adId')
  @UseInterceptors(ClassSerializerInterceptor)
  getReviews(
    @Param('adId', ParseIntPipe) adId: number,
  ) {
    return this.itemService.getReviews(adId);
  }

  @UseGuards(JwtGuard)
  @Post('askQuestion')
  askQuestion(
    @GetUser('id', ParseIntPipe) id: number,
    @Body() dto: AskQuestionDto,
  ) {
    return this.itemService.askQuestion(id, dto);
  }
}
