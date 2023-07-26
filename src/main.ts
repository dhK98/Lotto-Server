import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Config from './config/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle("document")
  .setDescription("API Description")
  .setVersion("1.0")
  .addTag('server')
  .build();

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document);

  await app.listen(Config.port);
}
bootstrap();
