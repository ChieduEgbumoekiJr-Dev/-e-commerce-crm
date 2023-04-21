import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3330;
  const configService = app.get(ConfigService);
  const ANALYTICS_SERVICE_URL = configService.get<string>(
    'ANALYTICS_SERVICE_URL',
    'http://localhost:3335'
  );
  const PRODUCTS_SERVICE_URL = configService.get<string>(
    'PRODUCTS_SERVICE_URL',
    'http://localhost:3334'
  );
  const USERS_SERVICE_URL = configService.get<string>(
    'USERS_SERVICE_URL',
    'http://localhost:3333'
  );
  app.use(
    '/api/users',
    createProxyMiddleware({
      target: USERS_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: {
        [`^/api/users`]: '/users',
      },
    })
  );
  app.use(
    '/api/products',
    createProxyMiddleware({
      target: PRODUCTS_SERVICE_URL,
      changeOrigin: true,
    })
  );
  app.use(
    '/api/analytics',
    createProxyMiddleware({
      target: ANALYTICS_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: {
        [`^/api/analytics`]: '/analytics',
      },
    })
  );

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
