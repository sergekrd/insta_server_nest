import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './insta/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // Listen on all available network interfaces
      port: 12001, // Choose a suitable port for your TCP service
    },
  });
  await app.startAllMicroservices();
  await app.listen(12000); // or your desired HTTP port
}
bootstrap();
