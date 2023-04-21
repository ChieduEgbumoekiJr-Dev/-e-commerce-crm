import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        keepConnectionAlive: true,
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        // migrations: ['**/migrations/*.js'],
        // migrationsRun: true,
        synchronize: true, //use migrations instead for production...
        cli: {
          entitiesDir: '../**/entities/**/*.entity{.js,.ts}',
          // migrationsDir: '**/migrations',
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class TypeOrmCustomModule {}
