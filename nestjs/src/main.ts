import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as YAML from 'yaml';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  const config = new DocumentBuilder()
    .setTitle('Tasks')
    .setDescription('The tasks API description')
    .setVersion('1.0')
    .addTag('tasks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // fs.writeFileSync('./swagger-spec.yaml', YAML.stringify(document));
  console.log('document:', document);
  SwaggerModule.setup('api', app, document);

  const yamlString: string = YAML.stringify(document, {});
  console.log('yamlString:', yamlString);
  fs.writeFileSync('./swagger-open-api.yaml', yamlString);

  const file = fs.readFileSync('./swagger-open-api.yaml', 'utf8');

  await app.listen(3001);
}
bootstrap();
