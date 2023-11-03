import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  pName: string;

  @IsString()
  pDescription: string;

  @IsString()
  pPrice: number;

  @IsNotEmpty()
  categoryId: string;

  @IsNotEmpty()
  isActive: boolean;

  constructor() {}
}
