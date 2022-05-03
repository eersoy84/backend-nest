import { Allow, IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class AddressDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  @IsString()
  district: string;

  @IsNotEmpty()
  @IsString()
  addressText: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  town: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @Min(0)
  @Max(1)
  @IsNumber()
  isCorporate: number;

  @IsNotEmpty()
  @IsBoolean()
  default: boolean = false;

  @IsNotEmpty()
  @IsString()
  addressTitle: string;

  @IsString()
  companyName: string;

  @IsString()
  taxNumber: string;

  @IsString()
  taxOffice: string;
}
