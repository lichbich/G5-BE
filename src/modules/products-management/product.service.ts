import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../entitys/products.entity';
import { CreateProductDto } from '../auth-management/dtos/createProduct.dto';
import { Category } from '../../entitys/categories.entity';
import { handleSuccessRequest } from '../../models/common';
import { UpdateProductDto } from '../auth-management/dtos/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Category) private catRepo: Repository<Category>,
  ) {}

  async getProducts(searchName = '', skip = 0, take = 10) {
    const [result, total] = await this.productRepo.findAndCount({
      where: { pName: ILike(`%${searchName}%`) },
      take: take,
      skip: skip,
    });
    return { data: result, total: total };
  }

  async createProduct(createProductDto: CreateProductDto, filePath: string) {
    const product = new Product();
    product.pName = createProductDto.pName;
    product.pDescription = createProductDto.pDescription;
    product.pPrice = createProductDto.pPrice;
    product.pQuantity = createProductDto.pQuantity;
    product.pImgLink = filePath;
    product.isActive = createProductDto.isActive;
    product.category = await this.catRepo.findOneBy({
      id: createProductDto.categoryId,
    });
    return this.productRepo
      .save(product)
      .then(() => handleSuccessRequest({}))
      .catch(() => {
        throw new HttpException('ERROR', HttpStatus.BAD_REQUEST);
      });
  }

  async updateProduct(updateProductDto: UpdateProductDto) {
    const category = await this.catRepo.findOneBy({
      id: updateProductDto.categoryId,
    });
    return this.productRepo
      .update(
        { id: updateProductDto.id },
        {
          pName: updateProductDto.pName,
          pDescription: updateProductDto.pDescription,
          pPrice: updateProductDto.pPrice,
          category: category,
          isActive: updateProductDto.isActive,
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