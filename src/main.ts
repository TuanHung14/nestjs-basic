import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

// để chạy chương trình kh cần chạy lệnh lại
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards( new JwtAuthGuard(reflector));


  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get<string>('PORT'));
  
  // để chạy chương trình kh cần chạy lệnh lại
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
