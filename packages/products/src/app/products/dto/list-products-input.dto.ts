import { IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListProductsInput {
  @ApiProperty({
    minimum: 0,
    maximum: 100,
    description: 'Products limit',
  })
  @Max(100)
  @Min(0)
  @IsNumber()
  limit: number;
  @ApiProperty({
    minimum: 0,
    description: 'Products offset',
  })
  @Min(0)
  @IsNumber()
  offset: number;
}
