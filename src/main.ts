import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './exception-filters/entity-not-found.exception-filter';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: 422 }));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50051',
      package: 'product',
      protoPath: join(__dirname, 'products/proto/product.proto'),
    },
  });
  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
