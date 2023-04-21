import {
  ArrayMinSize,
  IsArray,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import Status from '../types/status.types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VariantDto {
  @ApiProperty({
    description: 'Variant sku',
  })
  @IsString()
  sku: string;
  @ApiProperty({
    description: 'Variant title',
  })
  @IsString()
  title: string;
  @ApiPropertyOptional({
    type: Number,
    description: 'Variant weight',
  })
  @IsNumber()
  @IsOptional()
  weight?: number;
  @ApiPropertyOptional({
    description: 'Variant weight unit',
  })
  @IsString()
  @IsOptional()
  weight_unit?: string;
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
  })
  @IsString()
  name: string;
  @ApiProperty({
    enum: Status,
    description: 'Product status',
  })
  @IsString()
  status: Status;
  @ApiProperty({
    description: 'Product type',
  })
  @IsString()
  type: string;
  @ApiProperty({
    type: [String],
    description: 'Product categories',
  })
  @IsArray()
  @ArrayMinSize(1)
  categories: string[];
  @ApiProperty({
    type: [VariantDto],
    description: 'Product categories',
  })
  @IsArray()
  @ArrayMinSize(1)
  variants: VariantDto[];
}
