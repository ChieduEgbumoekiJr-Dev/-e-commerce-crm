import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, VariantDto } from './dto/create-product.dto';
import { ListProductsInput } from './dto/list-products-input.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { VariantEntity } from './entities/variant.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(VariantEntity)
    private readonly variantRepository: Repository<VariantEntity>
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create({
      name: createProductDto.name,
      type: createProductDto.type,
      categories: createProductDto.categories,
      status: createProductDto.status,
    });
    await this.productRepository.save(product);
    createProductDto.variants.map(async (variant: VariantDto) => {
      const productVariant = this.variantRepository.create({
        sku: variant.sku,
        title: variant.title,
        weight: variant.weight,
        weight_unit: variant.weight_unit,
      });
      productVariant.product = product;
      await this.variantRepository.save(productVariant);
    });
    return product;
  }

  listAll(listProductsInput: ListProductsInput) {
    return this.productRepository.find({
      skip: listProductsInput.offset,
      take: listProductsInput.limit,
      relations: {
        variants: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        variants: true,
      },
    });
    if (product) return product;
    throw new NotFoundException('Product not found');
  }

  delete(id: string) {
    this.productRepository.delete(id);
    return { message: `Product deleted successfully.` };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.productRepository.update(
      id,
      updateProductDto
    );
    if (updatedProduct) return { message: `Product updated successfully.` };
    throw new NotFoundException('Product not found');
  }
}
