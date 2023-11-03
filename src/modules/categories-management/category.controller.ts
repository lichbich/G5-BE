import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import ResponseEntityBuilder from '../../models/response/common/ResponseEntityBuilder';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from '../auth-management/dtos/createCategory.dto';
import { Public } from '../_guards/jwt-auth.guard';
import { UpdateCategoryDto } from '../auth-management/dtos/updateCategory.dto';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  async getAllCategories() {
    return ResponseEntityBuilder.getBuilder()
      .setData(await this.categoryService.getAllCategories())
      .build();
  }

  @Public()
  @Post()
  async createCategory(@Body() category: CreateCategoryDto) {
    const categoryDto = new CreateCategoryDto();
    categoryDto.catName = category.catName;
    categoryDto.catDescription = category.catDescription;
    categoryDto.isActive = category.isActive;

    return this.categoryService.createCategory(categoryDto);
  }

  @Public()
  @Post('/update')
  async updateCategory(@Body() category: UpdateCategoryDto) {
    return this.categoryService.updateCategory(category);
  }
  @Public()
  @Delete('/delete/:id')
  async deleteCategory(@Param('id') id) {
    return this.categoryService.deleteCategory(id);
  }
}
