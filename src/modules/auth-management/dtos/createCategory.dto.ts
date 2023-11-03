import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  catName: string;

  @IsString()
  catDescription: string;

  @IsNotEmpty()
  isActive: boolean;

  constructor() {}
}
