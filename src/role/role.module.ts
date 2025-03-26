import { Module } from '@nestjs/common';
import { RoleModelProvider } from '~/mongo/connect/role.schema';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleModelProvider],
  exports: [RoleService],
})
export class RoleModule {}
