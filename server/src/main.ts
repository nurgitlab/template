import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  //Todo Переписать на логер
  console.log('Application started', process.env.PORT);
  await app.listen(process.env.PORT ?? 3050);
}

bootstrap();
