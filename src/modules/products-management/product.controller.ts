import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../_guards/jwt-auth.guard';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from '../auth-management/dtos/createProduct.dto';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { UpdateProductDto } from '../auth-management/dtos/updateProduct.dto';
import { getStorage } from 'src/utils/fileConfig';

export const storage = {
  storage: diskStorage({
    destination: './uploads/image',
    filename(req, file, cb) {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Public()
  @Get()
  async getProducts(@Query() query) {
    return this.productService.getProducts(
      query.searchName || '',
      Number(query.page || 0) * Number(query.size || 0),
      Number(query.size || 10),
    );
  }

  @Public()
  @Get()
  async getProductsDetail(@Param() id: String) {
    return this.productService.getProductDetail(id);
  }

  @Public()
  @Get('/none-best-seller')
  async getProductsNoneBestSeller(@Query() query) {
    return this.productService.getProductsNoneBestSeller(
      query.searchName || '',
      Number(query.page || 0) * Number(query.size || 0),
      Number(query.size || 10),
    );
  }

  @Public()
  @Get('/best-seller-customer')
  async getProductsBestSellerCustomer(@Query() query) {
    return this.productService.getProductsBestSellerCustomer(
        query.searchName || '',
        Number(query.page || 0) * Number(query.size || 0),
        Number(query.size || 10),
    );
  }

  @Public()
  @Get('/best-seller')
  async getProductsBestSeller(@Query() query) {
    return this.productService.getProductsBestSeller(
      query.searchName || '',
      Number(query.page || 0) * Number(query.size || 0),
      Number(query.size || 10),
    );
  }

  @Public()
  @Get('/add-best-seller/:id')
  async addBestSellerTag(@Param('id') id: string) {
    return this.productService.addBestSellerTag(id);
  }

  @Public()
  @Get('/remove-best-seller/:id')
  async removeBestSellerTag(@Param('id') id: string) {
    return this.productService.removeBestSellerTag(id);
  }

  @Public()
  @Get('/getByCategory')
  async getProductsByCategory(@Query() query) {
    return this.productService.getProductsByCategory(
      query.categoryId || '',
      query.searchName,
      Number(query.page || 0) * Number(query.size || 0),
      Number(query.size || 10),
    );
  }

  @Public()
  @UseInterceptors(FileInterceptor('file', { storage: getStorage('image') }))
  @Post()
  async createProduct(@UploadedFile() file, @Body() createProductDto: CreateProductDto) {
    if (file) {
      const filePath = file.path;
      return this.productService.createProduct(createProductDto, filePath);
    } else {
      return this.productService.createProduct(createProductDto, '');
    }
  }

  @Public()
  @Post('/update')
  async updateProduct(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(updateProductDto, '');
  }
  @Public()
  @Delete('/delete/:id')
  async deleteCategory(@Param('id') id) {
    return this.productService.deleteCategory(id);
  }

  @Public()
  @UseInterceptors(FileInterceptor('file', { storage: getStorage('image') }))
  @Post('/update/:id')
  async updateProductImage(@Param('id') id, @UploadedFile() file, @Body() updateProductDto: UpdateProductDto) {
    if (file) {
      const filePath = file.path;
      return this.productService.updateProduct(updateProductDto, filePath);
    } else {
      return this.productService.updateProduct(updateProductDto, '');
    }
  }
}
