import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
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
  @UsePipes(
    new ValidationPipe({
      skipMissingProperties: true,
    }),
  )
  @UseInterceptors(ClassSerializerInterceptor)
  cartGet(
    @GetUser('id', ParseIntPipe) id: number,
    @Body() dto: CartRequestDto,
  ) {
    return this.cartService.cartGet(id, dto);
  }

  @Post('getBySeller')
  @UseGuards(JwtGuard)
  cartGetBySeller() {}

  @Post('update')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  cartUpdate(
    @GetUser('id', ParseIntPipe) id: number,
    @Body() dto: CartRequestDto,
  ) {
    return this.cartService.cartUpdate(id, dto);
  }

  @Get('return-reasons')
  getReturnReasons() {
    return this.cartService.getReturnReasons();
  }

  @Get('rating-form')
  getRatingForm() {
    return this.cartService.getRatingForm();
  }
}
