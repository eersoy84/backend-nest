import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorator';
import { JwtGuard } from 'src/shared/guard';
import { CartService } from './cart.service';

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
  cartGet() {}

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
