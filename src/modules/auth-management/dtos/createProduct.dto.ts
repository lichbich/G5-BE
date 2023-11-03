import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  pName: string;

  @IsString()
  pDescription: string;

  @IsString()
  pPrice: number;

  @IsString()
  pQuantity: number;

  @IsNotEmpty()
  categoryId: string;

  @IsNotEmpty()
  isActive: boolean;

  constructor() {}
}
