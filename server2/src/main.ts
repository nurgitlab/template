import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from "node:process";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Todo Переписать на логер
  console.log("Application started", process.env.PORT);
  await app.listen(process.env.PORT ?? 3050);
}
bootstrap();


