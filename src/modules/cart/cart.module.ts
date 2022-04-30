import { Module } from '@nestjs/common';
import { RoutineService } from '../routine/routine.service';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService, RoutineService],
})
export class CartModule {}
