import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductGrpcServerController } from './product-grpc-server/product-grpc-server.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController, ProductGrpcServerController],
  providers: [ProductsService],
})
export class ProductsModule {}
