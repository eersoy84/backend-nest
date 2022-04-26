import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  shippingAddressId: number;

  @IsNumber()
  @IsNotEmpty()
  billingAddressId: number;
}
