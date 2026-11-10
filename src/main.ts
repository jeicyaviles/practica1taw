import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos que no están en el DTO
      forbidNonWhitelisted: true, // responde 400 si llegan campos desconocidos
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Cine - TAW-251')
    .setDescription(
      'API REST para administrar salas, películas, géneros, funciones, clientes y venta de boletos.',
    )
    .setVersion('1.0')
    .addBearerAuth() // permite probar los endpoints protegidos con JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Documentación con Scalar en /docs
  app.use(
    '/docs',
    apiReference({
      content: document,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`API:    http://localhost:${port}`);
  console.log(`Scalar: http://localhost:${port}/docs`);
}
bootstrap();
