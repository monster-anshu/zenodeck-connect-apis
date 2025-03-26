import { Global, Module } from '@nestjs/common';
import { AgentModelProvider } from '~/mongo/connect/agent.schema';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

@Global()
@Module({
  controllers: [AgentController],
  providers: [AgentService, AgentModelProvider],
})
export class AgentModule {}
