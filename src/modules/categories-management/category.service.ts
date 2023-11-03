import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../../entitys/categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { handleSuccessRequest } from '../../models/common';
import { CreateCategoryDto } from '../auth-management/dtos/createCategory.dto';
import { UpdateCategoryDto } from '../auth-management/dtos/updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Category) private catRepo: Repository<Category>,
  ) {}
  async getAllCategories() {
    return await this.catRepo.find({ where: { delYn: false } });
  }

  async createCategory(categoryDto: CreateCategoryDto) {
    const category = new Category();
    category.catName = categoryDto.catName;
    category.catDescription = categoryDto.catDescription;
    category.isActive = categoryDto.isActive;
    return this.catRepo
      .save(category)
      .then(() => handleSuccessRequest({}))
      .catch(() => {
        throw new HttpException('ERROR', HttpStatus.BAD_REQUEST);
      });
  }

  async updateCategory(category: UpdateCategoryDto) {
    return this.catRepo
      .update(
        { id: category.id },
        {
          catName: category.catName,
          catDescription: category.catDescription,
          isActive: category.isActive,
        },
      )
      .then(() => handleSuccessRequest({}))
      .catch(() => {
        throw new HttpException('ERROR', HttpStatus.BAD_REQUEST);
      });
  }

  async deleteCategory(id: string) {
    return this.catRepo
      .update(
        { id: id },
        {
          delYn: true,
        },
      )
      .then(() => handleSuccessRequest({}))
      .catch(() => {
        throw new HttpException('ERROR', HttpStatus.BAD_REQUEST);
      });
  }
}
