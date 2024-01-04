import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './@core/exception/exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
export const title_app = `Estilos Api`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.useGlobalPipes(new ValidationPipe());

  //app.useGlobalFilters(new AllExceptionsFilter());

 /*  const options = new DocumentBuilder()
    .setTitle(title_app)
    .setVersion('1.0')
    .setDescription(
      `Credenciales para obtener un jwt </br> {</br>"email": ,</br>"password": </br>}`,
    )
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'headers',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document); */

  await app.listen(3000);
}
bootstrap();
