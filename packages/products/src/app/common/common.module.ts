import { Module } from '@nestjs/common';
import { AuthzModule } from './authz.module';
import { ConfigurationModule } from './configuration.module';
import { TypeOrmCustomModule } from './typeprm.module';

@Module({
  imports: [ConfigurationModule, TypeOrmCustomModule, AuthzModule],
  exports: [ConfigurationModule, TypeOrmCustomModule, AuthzModule],
})
export class CommonModule {}
