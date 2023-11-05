import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Equal, ILike, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductTags } from '../../entitys/products.entity';
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
  ) { }

  async getProducts(searchName = '', skip = 0, take = 10) {
    const [result, total] = await this.productRepo.findAndCount({
      where: { pName: ILike(`%${searchName}%`), delYn: false },
      relations: ['category'],
      take: take,
      skip: skip,
    });
    return { data: result, total: total };
  }

  async getProductsNoneBestSeller(searchName = '', skip = 0, take = 10) {
    const [result, total] = await this.productRepo.findAndCount({
      where: { pName: ILike(`%${searchName}%`), delYn: false, pTag: Not(ProductTags.BestSeller) },
      relations: ['category'],
      take: take,
      skip: skip,
    });
    
    return { data: result, total: total };
  }

  async getProductsBestSeller(searchName = '', skip = 0, take = 10) {
    const [result, total] = await this.productRepo.findAndCount({
      where: { pName: ILike(`%${searchName}%`), delYn: false, pTag: ProductTags.BestSeller },
      relations: ['category'],
      take: take,
      skip: skip,
    });
    return { data: result, total: total };
  }

  async addBestSellerTag(id: string) {
    return this.productRepo.update({ id }, { pTag: ProductTags.BestSeller });
  }

  async removeBestSellerTag(id: string) {
    return this.productRepo.update({ id }, { pTag: ProductTags.NoneBestSeller });
  }

  async getProductDetail(id) {
    const product = this.productRepo.find({ where: { id } });
    return product;
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

  async updateProduct(updateProductDto: UpdateProductDto, filePath: string) {
    const category = await this.catRepo.findOneBy({
      id: updateProductDto.categoryId,
    });
    const updateContent: any = {
      pName: updateProductDto.pName,
      pDescription: updateProductDto.pDescription,
      pPrice: updateProductDto.pPrice,
      category: category,
      pQuantity: updateProductDto.pQuantity,
      isActive: updateProductDto.isActive === 'true',
    };
    if (filePath) updateContent.pImgLink = filePath;
    return this.productRepo
      .update({ id: updateProductDto.id }, { ...updateContent })
      .then(() => handleSuccessRequest({}))
      .catch(() => {
        throw new HttpException('ERROR', HttpStatus.BAD_REQUEST);
      });
  }

  async deleteCategory(id: string) {
    return this.productRepo
      .update({ id: id }, { delYn: true })
      .then(() => handleSuccessRequest({}))
      .catch(() => {
        throw new HttpException('ERROR', HttpStatus.BAD_REQUEST);
      });
  }

  updateProductImage(id, filePath: string) {
    return this.productRepo
      .update({ id: id }, { pImgLink: filePath })
      .then(() => handleSuccessRequest({}))
      .catch(() => {
        throw new HttpException('ERROR', HttpStatus.BAD_REQUEST);
      });
  }

  async getProductsByCategory(
    categoryId = '',
    searchName = '',
    skip = 0,
    take = 10,
  ) {
    const query = this.productRepo
      .createQueryBuilder('p')
      .where('p.category = :categoryId', { categoryId })
      .andWhere('p.pName like :name', { name: `%${searchName}%` })
      .andWhere('p.delYn = false')
      .take(take)
      .skip(skip);
    const total = await query.getCount();
    const { entities } = await query.getRawAndEntities();
    return { data: entities, total: total };
  }
}
