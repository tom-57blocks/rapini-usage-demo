import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as YAML from 'yaml';
import * as fs from 'fs';
import swaggerUi from 'swagger-ui-express';

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
  fs.writeFileSync('./with-extensions.yaml', yamlString);

  const file = fs.readFileSync('./with-extensions.yaml', 'utf8');
  // const swaggerDocument = YAML.parse(file)

  // app.use('/api-yaml', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  //   app.get('/myfile', (req:any, res:any) => {
  //     res.sendFile("./with-extensions.yaml");
  //  });

  // await app.listen(process.env.NEST_PORT);
  await app.listen(3001);
}
bootstrap();
