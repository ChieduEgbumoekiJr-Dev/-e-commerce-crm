import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { VariantEntity } from './entities/variant.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, VariantEntity])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
