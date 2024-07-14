import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 3000;
console.log(`Using port: ${port}`);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'https://frontend-3gybwadubq-uc.a.run.app',
    },
  });
  await app.listen(port);
}
bootstrap();
