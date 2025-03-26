import { Module } from '@nestjs/common';
import { AgentModule } from '~/agent/agent.module';
import { ConnectAppModule } from '~/connect-app/connect-app.module';
import { CustomFieldModule } from '~/custom-field/custom-field.module';
import { RoleModule } from '~/role/role.module';
import { InternalController } from './internal.controller';
import { InternalService } from './internal.service';

@Module({
  controllers: [InternalController],
  providers: [InternalService],
  imports: [RoleModule, AgentModule, ConnectAppModule, CustomFieldModule],
})
export class InternalModule {}
