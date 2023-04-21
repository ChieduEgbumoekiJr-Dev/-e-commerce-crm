import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [CommonModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
