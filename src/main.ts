import { join } from 'path';
import { urlencoded, json } from 'express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './modules/app.module';
import { NestApplication, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { ValidationFilter } from './config/exceptionHandler/ValidationFilter';
import { ValidationException } from './config/exceptionHandler/ValidationException';
import { GlobalHttpExceptionFilter } from './config/exceptionHandler/GlobalHttpExceptionFilter';

(async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  const logger = new Logger('bootstrap');

  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalFilters(
    new ValidationFilter(),
    new GlobalHttpExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        return new ValidationException(errors);
      },
    }),
  );

  app.use(cookieParser());
  app.use(json({ limit: '1000mb' }));
  app.use(urlencoded({ limit: '1000mb', extended: true }));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    index: false,
    prefix: '/uploads',
  });
  await app.listen(8888, '0.0.0.0');
  logger.log(`Server is running at ${await app.getUrl()}`);
})();
