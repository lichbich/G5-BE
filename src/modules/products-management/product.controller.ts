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
  constructor(private readonly productService: ProductService) {}

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
  @UseInterceptors(FileInterceptor('file', storage))
  @Post()
  async createProduct(
    @UploadedFile() file,
    @Body() createProductDto: CreateProductDto,
  ) {
    const filePath = file.destination.replace('.') + '/' + file.filename;
    return this.productService.createProduct(createProductDto, filePath);
  }

  @Public()
  @Post('/update')
  async updateProduct(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(updateProductDto);
  }
  @Public()
  @Delete('/delete/:id')
  async deleteCategory(@Param('id') id) {
    return this.productService.deleteCategory(id);
  }

  @Public()
  @UseInterceptors(FileInterceptor('file', storage))
  @Post('/update/:id')
  async updateProductImage(@Param('id') id, @UploadedFile() file) {
    const filePath = file.destination.replace('.') + '/' + file.filename;
    return this.productService.updateProductImage(id, filePath);
  }
}
