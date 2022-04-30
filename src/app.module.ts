import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoryModule } from './modules/category/category.module';
import { ItemModule } from './modules/item/item.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { OrderModule } from './modules/order/order.module';
import { RoutineModule } from './modules/routine/routine.module';

@Module({
  imports: [AuthModule, CartModule, ItemModule, CategoryModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), UserModule, OrderModule, RoutineModule],
  providers: [PrismaService],
})
export class AppModule {}
