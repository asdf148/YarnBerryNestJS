import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const option = new DocumentBuilder()
    .setTitle('Anything API Docs')
    .setDescription('Multiple skills? applied project')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, option);
  SwaggerModule.setup('docs', app, document);
}
