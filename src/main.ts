import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from "cookie-parser";
import { SuperAdminService } from './helpers/superAdmin';

require('dotenv').config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  )
  
  await app.get(SuperAdminService).isSuperAdmin()
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
