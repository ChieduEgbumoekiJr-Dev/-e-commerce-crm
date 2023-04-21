import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth/jwt.guard';
import { OnlyAdminCanUseRestGuard } from '../common/auth/only.admin.can.use.rest.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsInput } from './dto/list-products-input.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import {
  ApiOkResponse,
  ApiUnprocessableEntityResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({ description: 'Product created.' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Products list.' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  listProducts(@Query() listProductsInput: ListProductsInput) {
    return this.productsService.listAll(listProductsInput);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Found product.' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(OnlyAdminCanUseRestGuard)
  @Patch(':id')
  @ApiOkResponse({ description: 'Product updated.' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(OnlyAdminCanUseRestGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'Product removed.' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  remove(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
