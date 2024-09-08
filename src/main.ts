import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomResponseInterceptor } from './Interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new CustomResponseInterceptor());
  await app.listen(process.env.PORT);
}
bootstrap();
