import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { InternalModule } from './internal/internal.module';
import { AgentModule } from './agent/agent.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [InternalModule, AgentModule, RoleModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
