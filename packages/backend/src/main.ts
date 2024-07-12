import { NestFactory } from '@nestjs/core';
import { GeneratorModule } from './generator/generator.module';

async function bootstrap() {
  const app = await NestFactory.create(GeneratorModule);
  await app.listen(3000);
}
bootstrap();
