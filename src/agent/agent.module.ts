import { Global, Module } from '@nestjs/common';
import { AgentModelProvider } from '~/mongo/connect/agent.schema';
import { RoleModule } from '~/role/role.module';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

@Global()
@Module({
  controllers: [AgentController],
  providers: [AgentService, AgentModelProvider],
  imports: [RoleModule],
  exports: [AgentService],
})
export class AgentModule {}
