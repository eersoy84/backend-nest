import { Body, Controller, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/shared/decorator';
import { JwtGuard } from 'src/shared/guard';
import { CancelProductDto, RateItemDto, RateSellerDto } from './dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('rateItem')
  @UseGuards(JwtGuard)
  rateItem(@GetUser('id', ParseIntPipe) id: number, @Body() dto: RateItemDto) {
    return this.orderService.rateItem(id, dto);
  }

  @Post('rateSeller')
  @UseGuards(JwtGuard)
  rateSeller(@GetUser('id', ParseIntPipe) id: number, @Body() dto: RateSellerDto) {
    return this.orderService.rateSeller(id, dto);
  }

  @Post('cancelProduct')
  @UseGuards(JwtGuard)
  cancelProduct(@GetUser('id', ParseIntPipe) id: number, @Body() dto: CancelProductDto) {
    return this.orderService.cancelProduct(id, dto);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  createOrder(@GetUser('id', ParseIntPipe) id: number, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(id, dto);
  }

  @Post('retrieve')
  retrieve() {
    return this.orderService.retrieve();
  }
}
