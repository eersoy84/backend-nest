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
import { GetUser } from 'src/shared/decorator';
import { JwtGuard } from 'src/shared/guard';
import { CartService } from './cart.service';
import { CartRequestDto } from './dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get('list')
  @UseGuards(JwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  getCartList(@GetUser('id') id: number) {
    return this.cartService.getCartList(id);
  }

  @Post('get')
  @UseGuards(JwtGuard)
  cartGet(
    @GetUser('id', ParseIntPipe) id: number,
    @Body() dto: CartRequestDto,
  ) {
    console.log('dto', dto);
    return this.cartService.cartGet(id, dto);
  }

  @Post('getBySeller')
  @UseGuards(JwtGuard)
  cartGetBySeller() {}

  @Post('update')
  @UseGuards(JwtGuard)
  cartUpdate() {}

  @Get('return-reasons')
  getReturnReasons() {
    return this.cartService.getReturnReasons();
  }

  @Get('rating-form')
  getRatingForm() {
    return this.cartService.getRatingForm();
  }
}
