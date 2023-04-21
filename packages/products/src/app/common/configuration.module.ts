import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        AUTH_ISSUER_BASE_URL: Joi.string(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
        // AUTH0_MANAGEMENT_AUDIENCE: Joi.string(),
        AUTH_AUDIENCE: Joi.string(),
      }),
      envFilePath: [
        '.env.local',
        '.env',
        '.env.development',
        '.env.production',
        '.env.staging',
      ],
      isGlobal: true,
    }),
  ],
})
export class ConfigurationModule {}
