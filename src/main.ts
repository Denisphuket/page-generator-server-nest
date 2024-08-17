import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DTOS } from './swagger-dtos';
import * as bodyParser from 'body-parser';
import { AllExceptionsFilter } from './config/AllExceptionsFilter/all-exceptions.filter';
import { AppModule } from './App/app.module';

const PORT = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'log'],
  });

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('Server USA Theater API')
    .setDescription('Get available ticket from USA Theater')
    .setVersion('1.3.1')
    .addBearerAuth()
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // стрип неподходящие поля
      forbidNonWhitelisted: true, // ошибка, если есть неподходящие поля
      transform: true, // автоматически преобразовывать запросы к типу DTO
      disableErrorMessages: false, // показывать сообщения об ошибках
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  // app.useGlobalFilters(new ValidationExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter());

  const combinedDTOS = DTOS.flatMap(Object.values);
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: combinedDTOS,
  });
  SwaggerModule.setup('doc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(PORT, () => console.log(`App start PORT: ${PORT}`));
}
bootstrap();
