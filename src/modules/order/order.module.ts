import { Module } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { RoutineService } from '../routine/routine.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, CartService, RoutineService],
})
export class OrderModule {}
