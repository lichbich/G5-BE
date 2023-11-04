import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  product: Array<{
    id: string;
    price: number;
    quantity: number;
  }>;

  // @IsString()
  // @IsNotEmpty()
  // quantity: number;
  //
  // @IsString()
  // @IsNotEmpty()
  // price: number;

  constructor() {}
}
