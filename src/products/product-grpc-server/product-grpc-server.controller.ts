import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall, status } from 'grpc';
import { EntityNotFoundError } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsService } from '../products.service';

@Controller()
export class ProductGrpcServerController {
  constructor(private productsService: ProductsService) {}

  @GrpcMethod('ProductService')
  create(
    data: CreateProductDto,
    metadata: Metadata,
    call: ServerUnaryCall<any>,
  ) {
    console.log(data);
    return this.productsService.create(data);
  }

  @GrpcMethod('ProductService')
  update(
    data: { id: number; name: string; price: number },
    metadata: Metadata,
    call: ServerUnaryCall<any>,
  ) {
    const { id, ...rest } = data;
    return this.productsService.update(id, data);
  }

  @GrpcMethod('ProductService')
  findOne(data: { id: number }) {
    const { id } = data;
    return this.productsService.findOne(id);
  }

  @GrpcMethod('ProductService')
  async findAll() {
    const products = await this.productsService.findAll();
    return { data: products };
  }

  @GrpcMethod('ProductService', 'Delete')
  async remove(data: { id: number }) {
    const { id } = data;
    //return await this.productsService.remove(id);

    try {
      return await this.productsService.remove(id);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new RpcException({
          message: 'Product not found',
          code: status.NOT_FOUND,
        });
      }
    }
  }
}
