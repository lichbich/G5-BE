import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  catName: string;

  @IsString()
  catDescription: string;

  @IsNotEmpty()
  isActive: boolean;

  constructor() {}
}
